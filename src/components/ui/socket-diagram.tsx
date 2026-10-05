"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Room {
  id: string;
  name: string;
  cx: number;
  clients: Client[];
}

const SERVER = { x: 200, y: 150 };
const LIME = "#c9fd34";
const EDGE = "rgba(255,255,255,0.12)";

// Two rooms on one server. Purely illustrative: it shows the mechanism,
// not traffic from the real app.
const ROOMS: Room[] = [
  {
    id: "a",
    name: "unit-a",
    cx: 76,
    clients: [
      { id: "a1", x: 82, y: 66, label: "admin" },
      { id: "a2", x: 46, y: 152, label: "volunteer" },
      { id: "a3", x: 86, y: 236, label: "member" },
    ],
  },
  {
    id: "b",
    name: "unit-b",
    cx: 324,
    clients: [
      { id: "b1", x: 318, y: 66, label: "admin" },
      { id: "b2", x: 354, y: 152, label: "member" },
      { id: "b3", x: 314, y: 236, label: "volunteer" },
    ],
  },
];

// [room, sender] for each message in the loop.
const BURSTS: Array<[number, number]> = [
  [0, 1],
  [1, 0],
  [0, 2],
  [1, 2],
  [0, 0],
  [1, 1],
];

const logLine = (room: Room, delivered: number) =>
  `emit → room:${room.name} · ${delivered} delivered · 0 elsewhere`;

/**
 * Room-scoped broadcasting, drawn: a message climbs from one client to the
 * server and fans back out to its own room only. Runs on GSAP while in view,
 * and stands still for reduced motion.
 */
export default function SocketDiagram({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const logRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const one = (selector: string) => q(selector)[0] as Element;

      const tl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power2.out" } });

      BURSTS.forEach(([roomIndex, senderIndex], n) => {
        const room = ROOMS[roomIndex];
        const sender = room.clients[senderIndex];
        const recipients = room.clients.filter((_, i) => i !== senderIndex);
        const up = one("[data-pulse='up']");
        const hull = one(`[data-hull='${room.id}']`);
        const senderNode = one(`[data-node='${sender.id}']`);
        const senderEdge = one(`[data-edge='${sender.id}']`);
        const recipientEdges = recipients.map((client) => one(`[data-edge='${client.id}']`));
        const recipientNodes = recipients.map((client) => one(`[data-node='${client.id}']`));
        const label = `burst${n}`;

        tl.addLabel(label)
          .call(() => {
            if (logRef.current) logRef.current.textContent = logLine(room, recipients.length);
          })
          .to(hull, { opacity: 1, duration: 0.3 }, label)
          .to(senderNode, { attr: { r: 8.5 }, duration: 0.18, yoyo: true, repeat: 1 }, label)
          .to(senderEdge, { stroke: LIME, duration: 0.2 }, label)
          .set(up, { attr: { cx: sender.x, cy: sender.y }, opacity: 1 }, label)
          .to(up, { attr: { cx: SERVER.x, cy: SERVER.y }, duration: 0.6, ease: "power2.in" }, `${label}+=0.1`)
          .set(up, { opacity: 0 })
          .addLabel(`${label}-fan`)
          .fromTo(
            one("[data-server-ring]"),
            { attr: { r: 22 }, opacity: 0.9 },
            { attr: { r: 44 }, opacity: 0, duration: 0.7 },
            `${label}-fan`
          )
          .to(recipientEdges, { stroke: LIME, duration: 0.2 }, `${label}-fan`);

        recipients.forEach((client) => {
          const pulse = one(`[data-pulse='${client.id}']`);
          tl.set(pulse, { attr: { cx: SERVER.x, cy: SERVER.y }, opacity: 1 }, `${label}-fan`)
            .to(pulse, { attr: { cx: client.x, cy: client.y }, duration: 0.6 }, `${label}-fan`)
            .set(pulse, { opacity: 0 }, `${label}-fan+=0.6`);
        });

        tl.to(recipientNodes, { attr: { r: 8.5 }, duration: 0.18, yoyo: true, repeat: 1 }, `${label}-fan+=0.55`)
          .to([senderEdge, ...recipientEdges], { stroke: EDGE, duration: 0.6 }, `${label}-fan+=0.9`)
          .to(hull, { opacity: 0.4, duration: 0.6 }, `${label}-fan+=0.9`)
          .to({}, { duration: 0.35 });
      });

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) tl.play();
          else tl.pause();
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <figure ref={rootRef} className={cn("relative", className)}>
      <svg
        viewBox="0 0 400 300"
        role="img"
        aria-label="Diagram: a Socket.io server relays a message only to the clients in the sender's room."
        className="h-auto w-full overflow-visible"
      >
        {ROOMS.map((room) => (
          <g key={room.id}>
            <rect
              data-hull={room.id}
              x={room.cx - 62}
              y={22}
              width={124}
              height={258}
              rx={62}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeDasharray="3 6"
              opacity={0.4}
            />
            <text
              x={room.cx}
              y={12}
              textAnchor="middle"
              fontSize="9"
              fill="var(--text-muted)"
              style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}
            >
              ROOM:{room.name.toUpperCase()}
            </text>
          </g>
        ))}

        {ROOMS.flatMap((room) => room.clients).map((client) => (
          <line
            key={client.id}
            data-edge={client.id}
            x1={client.x}
            y1={client.y}
            x2={SERVER.x}
            y2={SERVER.y}
            stroke={EDGE}
            strokeWidth="1.2"
          />
        ))}

        <circle data-server-ring cx={SERVER.x} cy={SERVER.y} r="22" fill="none" stroke={LIME} opacity="0" />
        <circle cx={SERVER.x} cy={SERVER.y} r="22" fill="#151517" stroke="rgba(255,255,255,0.22)" />
        <text
          x={SERVER.x}
          y={SERVER.y + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fill="var(--text-primary)"
          style={{ fontFamily: "var(--font-heading)", fontVariationSettings: "'wght' 700" }}
        >
          io
        </text>

        {ROOMS.flatMap((room) => room.clients).map((client) => (
          <g key={client.id}>
            <circle
              data-node={client.id}
              cx={client.x}
              cy={client.y}
              r="6"
              fill="#0f0f10"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.5"
            />
            <text
              x={client.x}
              y={client.y + 18}
              textAnchor="middle"
              fontSize="8.5"
              fill="var(--text-muted)"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {client.label}
            </text>
          </g>
        ))}

        <circle data-pulse="up" r="4" fill={LIME} opacity="0" />
        {ROOMS.flatMap((room) => room.clients).map((client) => (
          <circle key={client.id} data-pulse={client.id} r="4" fill={LIME} opacity="0" />
        ))}
      </svg>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 mono uppercase text-fg-4">
        <span ref={logRef} aria-hidden className="text-fg-3">
          {logLine(ROOMS[0], ROOMS[0].clients.length - 1)}
        </span>
        <span>Drawn, not recorded</span>
      </figcaption>
    </figure>
  );
}
