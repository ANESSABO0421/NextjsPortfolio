"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "@/components/providers/transition-provider";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Name shown on the transition curtain. */
  label?: string;
};

/**
 * A Next <Link> (so it still prefetches) whose plain left-clicks run through
 * the iris transition. Modified clicks, new-tab targets and middle clicks
 * fall through to the browser untouched.
 */
export default function TransitionLink({ href, label, onClick, target, ...rest }: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target && target !== "_self") return;

    event.preventDefault();
    // Keyboard activation reports detail 0 and no meaningful coordinates —
    // open the iris from the link itself instead.
    const rect = event.currentTarget.getBoundingClientRect();
    const origin =
      event.detail === 0
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: event.clientX, y: event.clientY };
    navigate(href, { label, origin });
  };

  return <Link href={href} target={target} onClick={handleClick} {...rest} />;
}
