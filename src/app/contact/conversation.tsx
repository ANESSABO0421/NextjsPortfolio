"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, Copy, CornerDownLeft, Pencil, RotateCcw } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getLenis, useIntroDone, usePageRevealed, useReducedMotion } from "@/lib/stores";
import { site } from "@/lib/site";
import { playTick } from "@/lib/sound";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/ui/magnetic";
import RollingText from "@/components/ui/rolling-text";
import TransitionLink from "@/components/ui/transition-link";
import LocalTime from "@/components/ui/local-time";

type FieldKey = "name" | "email" | "company" | "topic" | "timeline" | "message";
type Answers = Partial<Record<FieldKey, string>>;
type Stage = "chat" | "sealing" | "sent";

interface Step {
  key: FieldKey;
  ask: (answers: Answers) => string;
  input: "text" | "email" | "choice" | "textarea";
  placeholder?: string;
  choices?: string[];
  /** Optional fields offer a chip that answers with an empty string. */
  skip?: string;
  autoComplete?: string;
  validate?: (value: string) => string | null;
}

const ROLE_TOPIC = "A role on your team";
const firstName = (name?: string) => (name ?? "").trim().split(/\s+/)[0] || "there";

const STEPS: Step[] = [
  {
    key: "name",
    input: "text",
    autoComplete: "name",
    placeholder: "Your name",
    ask: () =>
      "Hi — I’m Anees Bot. I’ll take a few details and hand them straight to Anees. First, what should he call you?",
    validate: (value) => (value.length < 2 ? "A name with at least two letters, please." : null),
  },
  {
    key: "email",
    input: "email",
    autoComplete: "email",
    placeholder: "you@company.com",
    ask: (answers) => `Good to meet you, ${firstName(answers.name)}. Where can he reply?`,
    validate: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : "That doesn’t look like an email address yet.",
  },
  {
    key: "company",
    input: "text",
    autoComplete: "organization",
    placeholder: "Company or team",
    skip: "Just me",
    ask: () => "Are you writing on behalf of a company or a team?",
  },
  {
    key: "topic",
    input: "choice",
    ask: () => "What’s this about?",
    choices: ["A web app", "An ERP or HRMS", "A mobile app", "A business website", ROLE_TOPIC, "Something else"],
  },
  {
    key: "timeline",
    input: "choice",
    ask: (answers) =>
      answers.topic === ROLE_TOPIC ? "When would you want someone to start?" : "And when would you like to get going?",
    choices: ["As soon as possible", "Within a month", "In 1–3 months", "Just exploring"],
  },
  {
    key: "message",
    input: "textarea",
    placeholder: "A few lines about what you need…",
    ask: () => "Last one — tell him about it. A few lines is plenty.",
    validate: (value) => (value.length < 12 ? "Just a little more detail — a sentence or two." : null),
  },
];

const CLOSING = "That’s everything. The letter on the right is ready — send it whenever you are.";

const siteHost = site.url.replace(/^https?:\/\//, "");

function letterText(answers: Answers) {
  return [
    "Hi Anees,",
    "",
    answers.message ?? "",
    "",
    "—",
    `${answers.name ?? ""}${answers.company ? `, ${answers.company}` : ""}`,
    answers.email ?? "",
    "",
    `About: ${answers.topic ?? ""}`,
    `Timeline: ${answers.timeline ?? ""}`,
    "",
    `Sent from ${siteHost}/contact`,
  ].join("\r\n");
}

function mailtoFor(answers: Answers) {
  const subject = `${answers.topic ?? "Hello"} — ${answers.name ?? ""}${answers.company ? ` (${answers.company})` : ""}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(letterText(answers))}`;
}

/**
 * Contact as a conversation. Each answer is written into a letter in real
 * time; sending seals it into an envelope and hands it to the visitor's own
 * mail app — this site has no mail server, and says so.
 */
export default function Conversation() {
  const rootRef = useRef<HTMLElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const interactedRef = useRef(false);
  const ids = useId();

  const [answers, setAnswers] = useState<Answers>({});
  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shownBots, setShownBots] = useState(0);
  const [stage, setStage] = useState<Stage>("chat");
  const [copied, setCopied] = useState(false);

  const introDone = useIntroDone();
  const revealed = usePageRevealed();
  const ready = introDone && revealed;
  const reduceMotion = useReducedMotion();

  const firstOpen = STEPS.findIndex((step) => answers[step.key] === undefined);
  const complete = firstOpen === -1;
  const visible = complete ? STEPS : STEPS.slice(0, firstOpen + 1);
  const botTotal = visible.length + (complete ? 1 : 0);
  const typing = ready && shownBots < botTotal;
  const current = editing
    ? STEPS.find((step) => step.key === editing) ?? null
    : complete
      ? null
      : STEPS[firstOpen];
  const awaitingAnswer = !typing && shownBots >= botTotal;

  /* ── Bot "types" before each new line ──────────────────────────────── */
  useEffect(() => {
    if (!ready || shownBots >= botTotal) return;
    const delay = reduceMotion ? 0 : shownBots === 0 ? 900 : 750;
    const timer = window.setTimeout(() => setShownBots(botTotal), delay);
    return () => window.clearTimeout(timer);
  }, [ready, shownBots, botTotal, reduceMotion]);

  /* ── Keep the composer in view and focused once the visitor is engaged ─ */
  useEffect(() => {
    if (!interactedRef.current || !awaitingAnswer || stage !== "chat") return;
    const composer = composerRef.current;
    if (!composer) return;
    const lenis = getLenis();
    const rect = composer.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 120 || rect.top < 80) {
      const offset = -Math.max(120, window.innerHeight * 0.45);
      if (lenis) lenis.scrollTo(composer, { offset, duration: 0.9 });
      else composer.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    composer.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
  }, [awaitingAnswer, shownBots, editing, stage]);

  /* ── Title entrance ────────────────────────────────────────────────── */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const chars = root.querySelectorAll("[data-title-char]");
      const fades = root.querySelectorAll("[data-fade]");
      gsap.set(root.querySelectorAll(".intro-hidden"), { visibility: "visible" });
      if (prefersReducedMotion()) return;
      if (!ready) {
        gsap.set(chars, { yPercent: 115 });
        gsap.set(fades, { opacity: 0, y: 24 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(chars, { yPercent: 0, duration: 1.3, stagger: 0.035 }, 0.1)
        .to(fades, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.45);
    },
    { scope: rootRef, dependencies: [ready] }
  );

  /* ── New lines slide in ────────────────────────────────────────────── */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = rootRef.current?.querySelectorAll<HTMLElement>("[data-msg]:not([data-seen])");
      if (!items?.length) return;
      items.forEach((item) => item.setAttribute("data-seen", ""));
      gsap.fromTo(items, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.06 });
    },
    { scope: rootRef, dependencies: [shownBots, answers, typing] }
  );

  /* ── Sealing: the letter folds into an envelope that flies off ─────── */
  useGSAP(
    () => {
      if (stage !== "sealing") return;
      const desk = deskRef.current;
      if (!desk) return;
      const letter = desk.querySelector<HTMLElement>("[data-letter]");
      const envelope = desk.querySelectorAll<HTMLElement>("[data-envelope]");
      const flap = desk.querySelector<HTMLElement>("[data-flap]");
      const chat = rootRef.current?.querySelector<HTMLElement>("[data-chat]");
      const done = () => {
        // The sent screen is much shorter than a finished conversation.
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
        else window.scrollTo(0, 0);
        setStage("sent");
      };

      if (prefersReducedMotion() || !letter || !flap) {
        gsap.to([desk, chat], { opacity: 0, duration: 0.3, onComplete: done });
        return;
      }

      gsap
        .timeline({ onComplete: done })
        .to(chat ?? {}, { opacity: 0.25, duration: 0.4 }, 0)
        .set(envelope, { autoAlpha: 1 }, 0)
        .fromTo(envelope, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 0)
        .to(letter, { scaleX: 0.78, scaleY: 0.22, yPercent: -6, transformOrigin: "50% 100%", duration: 0.75, ease: "expo.inOut" }, 0.15)
        .to(flap, { rotateX: 0, duration: 0.55, ease: "power3.inOut" }, 0.85)
        .to(desk, { x: "38vw", y: "-75vh", rotate: 14, scale: 0.55, duration: 0.9, ease: "expo.in" }, 1.5)
        .to(chat ?? {}, { opacity: 0, duration: 0.4 }, 1.6);
    },
    { dependencies: [stage] }
  );

  const answer = (value: string) => {
    if (!current) return;
    const cleaned = value.trim();
    const problem = current.validate?.(cleaned) ?? null;
    if (problem) {
      setError(problem);
      return;
    }
    interactedRef.current = true;
    setAnswers((previous) => ({ ...previous, [current.key]: cleaned }));
    setEditing(null);
    setDraft("");
    setError(null);
    playTick(1.15);
  };

  const edit = (key: FieldKey) => {
    interactedRef.current = true;
    setEditing(key);
    setDraft(answers[key] ?? "");
    setError(null);
  };

  const startOver = () => {
    interactedRef.current = true;
    setAnswers({});
    setEditing(null);
    setDraft("");
    setError(null);
    setShownBots(0);
    setStage("chat");
    const leftovers = [deskRef.current, rootRef.current?.querySelector("[data-chat]")].filter(Boolean);
    if (leftovers.length) gsap.set(leftovers, { clearProps: "all" });
  };

  const send = () => {
    if (!complete) return;
    playTick(1.4);
    window.location.href = mailtoFor(answers);
    setStage("sealing");
  };

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\r\n\r\n${letterText(answers)}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  /* ── Sent ───────────────────────────────────────────────────────────── */
  if (stage === "sent") {
    return (
      <main id="main" ref={rootRef} className="relative min-h-[100svh] bg-night px-gutter pb-32 pt-28 sm:pt-36">
        <SentScreen
          answers={answers}
          copied={copied}
          onCopy={copyLetter}
          onRestart={startOver}
        />
      </main>
    );
  }

  /* ── Conversation ───────────────────────────────────────────────────── */
  const messageId = (index: number) => `${ids}-q-${index}`;
  const currentIndex = current ? STEPS.indexOf(current) : -1;

  return (
    <main id="main" ref={rootRef} className="relative min-h-[100svh] overflow-x-clip bg-night px-gutter pb-36 pt-28 sm:pt-36">
      <div data-fade className="intro-hidden flex items-center justify-between mono uppercase text-fg-3">
        <TransitionLink
          href="/"
          label="Index"
          className="roll-trigger group inline-flex items-center gap-2 transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:-translate-x-1" />
          <RollingText text="Index" />
        </TransitionLink>
        <span className="flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" />
          <LocalTime short /> in Kerala
        </span>
      </div>

      <h1 className="mt-10 font-heading text-[clamp(3rem,9vw,9rem)] leading-[0.86] tracking-[-0.04em] text-fg [font-variation-settings:'wght'_640] sm:mt-14">
        <span className="sr-only">Write to Anees.</span>
        <span aria-hidden className="intro-hidden block">
          {["Write to", "Anees."].map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {Array.from(line).map((char, i) => (
                <span key={i} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-top">
                  <span data-title-char className="inline-block">
                    {char === " " ? " " : char}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </span>
      </h1>

      <div className="mt-14 grid gap-16 sm:mt-20 lg:grid-cols-12 lg:gap-10">
        {/* Conversation */}
        <section data-chat aria-label="Conversation with Anees Bot" className="lg:col-span-7">
          <ol role="log" aria-live="polite" aria-relevant="additions" className="flex flex-col gap-7">
            {visible.map((step, index) => {
              const botShown = index < shownBots;
              const value = answers[step.key];
              return (
                <li key={step.key} className="flex flex-col gap-5">
                  {botShown && (
                    <BotLine id={messageId(index)} text={step.ask(answers)} highlight={editing === step.key} />
                  )}
                  {value !== undefined && botShown && (
                    <UserLine
                      value={value === "" ? step.skip ?? "Skipped" : value}
                      muted={value === ""}
                      fieldName={step.key}
                      editing={editing === step.key}
                      onEdit={() => edit(step.key)}
                      disabled={stage !== "chat"}
                    />
                  )}
                </li>
              );
            })}
            {complete && shownBots >= botTotal && (
              <li>
                <BotLine id={`${ids}-closing`} text={CLOSING} />
              </li>
            )}
            {typing && (
              <li aria-hidden data-msg className="flex items-center gap-3">
                <Avatar />
                <span className="flex h-9 items-center gap-1.5 rounded-full border border-line-2 px-4">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fg-2" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fg-2" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-fg-2" />
                </span>
              </li>
            )}
          </ol>

          {/* Composer */}
          <div ref={composerRef} className="mt-10 min-h-32">
            {awaitingAnswer && current && stage === "chat" && (
              <Composer
                key={`${current.key}-${editing ?? "new"}`}
                step={current}
                labelledBy={messageId(currentIndex)}
                draft={draft}
                error={error}
                editing={editing !== null}
                onDraft={(value) => {
                  setDraft(value);
                  if (error) setError(null);
                }}
                onAnswer={answer}
                onCancel={() => {
                  setEditing(null);
                  setDraft("");
                  setError(null);
                }}
              />
            )}
            {awaitingAnswer && !current && complete && stage === "chat" && (
              <div data-msg className="flex flex-wrap items-center gap-4">
                <Magnetic strength={0.35}>
                  <button
                    type="button"
                    data-autofocus
                    onClick={send}
                    className="roll-trigger group inline-flex items-center gap-3 rounded-full bg-lime px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-void"
                  >
                    <RollingText text="Seal & send the letter" />
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:rotate-45" />
                  </button>
                </Magnetic>
                <button
                  type="button"
                  onClick={startOver}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-fg-3 transition-colors hover:text-fg"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Start over
                </button>
                <p className="w-full mono uppercase text-fg-4">
                  Opens your mail app with everything filled in — nothing is sent until you press send there.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* The letter */}
        <aside aria-label="Your letter" className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <div ref={deskRef} className="relative [perspective:1400px]">
              <Envelope />
              <Letter answers={answers} activeKey={current?.key ?? null} />
              <EnvelopeFront />
            </div>

            <div data-fade className="intro-hidden mt-10 flex flex-col gap-4 border-t border-line-2 pt-6">
              <p className="mono uppercase text-fg-4">Rather skip the chat?</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${site.email}`}
                  className="rounded-full border border-line-2 px-4 py-2 text-sm text-fg-2 transition-colors hover:border-transparent hover:bg-fg hover:text-void"
                >
                  {site.email}
                </a>
                <a
                  href={site.phoneHref}
                  className="rounded-full border border-line-2 px-4 py-2 text-sm text-fg-2 transition-colors hover:border-transparent hover:bg-fg hover:text-void"
                >
                  {site.phone}
                </a>
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-transparent hover:bg-lime hover:text-void"
                >
                  <FaLinkedinIn className="h-3.5 w-3.5" />
                </a>
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line-2 text-fg-2 transition-colors hover:border-transparent hover:bg-lime hover:text-void"
                >
                  <SiGithub className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Pieces
   ───────────────────────────────────────────────────────────────────────── */

function Avatar() {
  return (
    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-line-2 bg-elevated">
      <Image src={site.portrait} alt="" fill sizes="36px" className="object-cover object-top" />
    </span>
  );
}

function BotLine({ id, text, highlight = false }: { id: string; text: string; highlight?: boolean }) {
  return (
    <div data-msg className="flex items-start gap-3">
      <Avatar />
      <div className="flex flex-col gap-1.5 pt-1">
        <span className="mono uppercase text-fg-4">Anees Bot</span>
        <p
          id={id}
          className={cn(
            "max-w-[34rem] text-[clamp(1.1rem,1.6vw,1.4rem)] font-light leading-snug transition-colors",
            highlight ? "text-lime" : "text-fg"
          )}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function UserLine({
  value,
  muted,
  fieldName,
  editing,
  disabled,
  onEdit,
}: {
  value: string;
  muted: boolean;
  fieldName: string;
  editing: boolean;
  disabled: boolean;
  onEdit: () => void;
}) {
  return (
    <div data-msg className="group flex items-start justify-end gap-3 pl-12">
      {!disabled && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Change your ${fieldName}`}
          className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fg-4 opacity-0 transition-[opacity,color] hover:text-fg focus-visible:opacity-100 group-hover:opacity-100"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
      <p
        className={cn(
          "max-w-[30rem] whitespace-pre-line break-words rounded-[1.4rem] rounded-tr-md border px-5 py-3 text-[clamp(1rem,1.35vw,1.15rem)] leading-snug",
          editing ? "border-lime/60 text-fg-3" : "border-line-3 text-fg",
          muted && "italic text-fg-3"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Composer({
  step,
  labelledBy,
  draft,
  error,
  editing,
  onDraft,
  onAnswer,
  onCancel,
}: {
  step: Step;
  labelledBy: string;
  draft: string;
  error: string | null;
  editing: boolean;
  onDraft: (value: string) => void;
  onAnswer: (value: string) => void;
  onCancel: () => void;
}) {
  const errorId = useId();

  if (step.input === "choice") {
    return (
      <div data-msg role="group" aria-labelledby={labelledBy} className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2.5">
          {step.choices?.map((choice, i) => (
            <button
              key={choice}
              type="button"
              data-autofocus={i === 0 ? true : undefined}
              onClick={() => onAnswer(choice)}
              onPointerEnter={() => playTick(0.9 + i * 0.05)}
              className="roll-trigger rounded-full border border-line-3 px-5 py-3 text-sm text-fg transition-colors duration-300 hover:border-transparent hover:bg-lime hover:text-void"
            >
              <RollingText text={choice} />
            </button>
          ))}
        </div>
        {editing && <CancelEdit onCancel={onCancel} />}
      </div>
    );
  }

  const multiline = step.input === "textarea";
  const fieldClass =
    "w-full resize-none bg-transparent pb-3 text-[clamp(1.25rem,2.2vw,1.85rem)] font-light leading-snug text-fg outline-none placeholder:text-fg-4";

  return (
    <form
      data-msg
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onAnswer(draft);
      }}
      className="flex flex-col gap-4"
    >
      <div
        className={cn(
          "flex items-end gap-4 border-b transition-colors duration-300 focus-within:border-lime",
          error ? "border-ember" : "border-line-3"
        )}
      >
        {multiline ? (
          <textarea
            data-autofocus
            rows={3}
            value={draft}
            placeholder={step.placeholder}
            aria-labelledby={labelledBy}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                onAnswer(draft);
              }
            }}
            data-lenis-prevent
            className={fieldClass}
          />
        ) : (
          <input
            data-autofocus
            type={step.input === "email" ? "email" : "text"}
            inputMode={step.input === "email" ? "email" : undefined}
            autoComplete={step.autoComplete}
            value={draft}
            placeholder={step.placeholder}
            aria-labelledby={labelledBy}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onDraft(event.target.value)}
            className={fieldClass}
          />
        )}
        <button
          type="submit"
          aria-label="Send answer"
          className="mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fg text-void transition-colors hover:bg-lime"
        >
          <CornerDownLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {error ? (
          <p id={errorId} role="alert" className="text-sm text-ember">
            {error}
          </p>
        ) : (
          <p className="mono uppercase text-fg-4">
            {multiline ? "Enter to send · Shift + Enter for a new line" : "Press Enter to answer"}
          </p>
        )}
        {step.skip && (
          <button
            type="button"
            onClick={() => onAnswer("")}
            className="rounded-full border border-line-2 px-4 py-1.5 text-xs uppercase tracking-[0.12em] text-fg-2 transition-colors hover:border-line-3 hover:text-fg"
          >
            {step.skip}
          </button>
        )}
        {editing && <CancelEdit onCancel={onCancel} />}
      </div>
    </form>
  );
}

function CancelEdit({ onCancel }: { onCancel: () => void }) {
  return (
    <button
      type="button"
      onClick={onCancel}
      className="self-start mono uppercase text-fg-3 underline decoration-line-3 underline-offset-4 transition-colors hover:text-fg"
    >
      Keep the previous answer
    </button>
  );
}

/* ── The letter ─────────────────────────────────────────────────────── */

function LetterField({ label, value, placeholder, active }: { label: string; value?: string; placeholder: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);

  useGSAP(
    () => {
      const el = ref.current;
      const before = previous.current;
      previous.current = value;
      if (!el || !value || value === before || prefersReducedMotion()) return;
      gsap.to(el, { duration: 0.8, scrambleText: { text: value, chars: "lowerCase", speed: 0.7 } });
    },
    { dependencies: [value] }
  );

  return (
    <div className="grid grid-cols-[4.25rem_1fr] items-baseline gap-3 border-b border-black/10 py-2.5">
      <dt className="mono uppercase text-black/40">{label}</dt>
      <dd className={cn("min-w-0 break-words text-[15px]", value ? "text-void" : "text-black/30")}>
        {/* Keyed by value: ScrambleText rewrites this node's text, so React must
            replace the element rather than patch a text node it no longer owns. */}
        <span key={value ?? ""} ref={ref}>
          {value || placeholder}
        </span>
        {active && <span aria-hidden className="ml-1 inline-block h-[1.05em] w-[2px] translate-y-[0.15em] animate-pulse bg-cobalt" />}
      </dd>
    </div>
  );
}

function Letter({ answers, activeKey }: { answers: Answers; activeKey: FieldKey | null }) {
  const from = answers.name ? `${answers.name}${answers.email ? ` <${answers.email}>` : ""}` : undefined;
  return (
    <article
      data-letter
      data-theme="light"
      className="relative z-[1] rounded-[0.35rem] bg-paper p-6 text-void shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] will-change-transform sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-heading text-2xl leading-none tracking-[-0.02em] [font-variation-settings:'wght'_700]">
            A letter to Anees
          </p>
          <p className="mt-2 mono uppercase text-black/45">Composed live as you answer</p>
        </div>
        <span
          aria-hidden
          className="flex h-14 w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[3px] border border-dashed border-black/25 mono text-[8px] uppercase leading-none text-black/45"
        >
          <span className="font-heading text-sm text-cobalt [font-variation-settings:'wght'_800]">AA</span>
          ’26
        </span>
      </div>

      <dl className="mt-6">
        <LetterField label="To" value={`Anees Aboobacker <${site.email}>`} placeholder="" active={false} />
        <LetterField label="From" value={from} placeholder="—" active={activeKey === "name" || activeKey === "email"} />
        <LetterField
          label="Org"
          value={answers.company === "" ? "Writing personally" : answers.company}
          placeholder="—"
          active={activeKey === "company"}
        />
        <LetterField label="Re" value={answers.topic} placeholder="—" active={activeKey === "topic"} />
        <LetterField label="When" value={answers.timeline} placeholder="—" active={activeKey === "timeline"} />
      </dl>

      <div className="mt-6 min-h-28">
        {answers.message ? (
          <p className="whitespace-pre-line break-words text-[15px] leading-relaxed text-black/80">
            <span className="text-black/45">Hi Anees,</span>
            {"\n\n"}
            {answers.message}
          </p>
        ) : (
          <p className="text-[15px] leading-relaxed text-black/30">
            Hi Anees,
            <br />
            <br />
            {activeKey === "message" ? "…" : "Your message will appear here."}
          </p>
        )}
      </div>

      <p className="mt-8 border-t border-black/10 pt-4 mono uppercase text-black/40">
        — via {siteHost}/contact
      </p>
    </article>
  );
}

/* Envelope layers — hidden until the letter is sealed. The back sits behind
   the letter, the pocket and flap in front of it. */
function Envelope() {
  return (
    <div
      aria-hidden
      data-envelope
      className="invisible absolute inset-x-[4%] bottom-[-2%] z-0 aspect-[1.55] rounded-[0.4rem] bg-[#d9d9d3] opacity-0"
    />
  );
}

function EnvelopeFront() {
  return (
    <div
      aria-hidden
      data-envelope
      className="invisible pointer-events-none absolute inset-x-[4%] bottom-[-2%] z-[2] aspect-[1.55] opacity-0 [transform-style:preserve-3d]"
    >
      <div className="absolute inset-0 rounded-[0.4rem] bg-[#e6e6e1] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] [clip-path:polygon(0_0,50%_52%,100%_0,100%_100%,0_100%)]" />
      <div
        data-flap
        className="absolute inset-x-0 top-0 h-[56%] origin-top bg-[#cfcfc8] [clip-path:polygon(0_0,100%_0,50%_100%)]"
        style={{ transform: "rotateX(178deg)" }}
      />
      <span className="absolute bottom-[16%] left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-cobalt font-heading text-[11px] text-white [font-variation-settings:'wght'_800]">
        AA
      </span>
    </div>
  );
}

/* ── After sending ──────────────────────────────────────────────────── */

function SentScreen({
  answers,
  copied,
  onCopy,
  onRestart,
}: {
  answers: Answers;
  copied: boolean;
  onCopy: () => void;
  onRestart: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-sent]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.09 }
      );
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="flex min-h-[70svh] flex-col justify-center">
      <p data-sent className="flex items-center gap-2 mono uppercase text-fg-3">
        <span className="h-1.5 w-1.5 rounded-full bg-lime" />
        Sealed · <LocalTime short /> IST
      </p>
      <h1
        data-sent
        className="mt-8 max-w-[14ch] font-heading text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.88] tracking-[-0.04em] text-fg [font-variation-settings:'wght'_660]"
      >
        Over to your mail app, {firstName(answers.name)}.
      </h1>
      <p data-sent className="mt-10 max-w-[38rem] text-lead font-light text-fg-2">
        Your letter should now be open in your email app, addressed and filled in — press send there and it’s on its
        way. Nothing opened? Copy it below, or write to{" "}
        <a href={`mailto:${site.email}`} className="text-fg underline decoration-line-3 underline-offset-4 hover:decoration-lime">
          {site.email}
        </a>{" "}
        directly.
      </p>
      <div data-sent className="mt-12 flex flex-wrap items-center gap-3">
        <a
          href={mailtoFor(answers)}
          className="roll-trigger group inline-flex items-center gap-3 rounded-full bg-lime px-7 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-void"
        >
          <RollingText text="Open it again" />
          <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:rotate-45" />
        </a>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-full border border-line-3 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-fg transition-colors hover:border-transparent hover:bg-fg hover:text-void"
        >
          {copied ? <Check className="h-4 w-4 text-lime" /> : <Copy className="h-4 w-4" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy the letter"}</span>
        </button>
        <TransitionLink
          href="/"
          label="Index"
          className="inline-flex items-center gap-2 rounded-full px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-fg-2 transition-colors hover:text-fg"
        >
          Back to the index
        </TransitionLink>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-full px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-fg-3 transition-colors hover:text-fg"
        >
          <RotateCcw className="h-4 w-4" /> Write another
        </button>
      </div>
    </div>
  );
}
