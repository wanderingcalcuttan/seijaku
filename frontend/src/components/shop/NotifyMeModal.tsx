"use client";

import { useEffect, useRef, useState } from "react";

import type { ProductView } from "@/src/lib/product-types";

type NotifyMeModalProps = {
  item: ProductView | null;
  isOpen: boolean;
  onClose: () => void;
};

const REQUEST_TIMEOUT_MS = 10_000;

export default function NotifyMeModal({ item, isOpen, onClose }: NotifyMeModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setEmail("");
    setStatus("idle");
    setErrorMessage(null);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => emailInputRef.current?.focus(), 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (status !== "success") {
      return undefined;
    }
    const timer = window.setTimeout(onClose, 1800);
    return () => window.clearTimeout(timer);
  }, [status, onClose]);

  if (!item) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") {
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch("/api/public/lead/product-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: item.slug,
          email,
          source: "product-card",
        }),
        signal: controller.signal,
      });

      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data?.error ?? "Unable to save your request right now.");
        return;
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      if (error instanceof DOMException && error.name === "AbortError") {
        setErrorMessage("Request took too long — please try again.");
      } else {
        setErrorMessage("Unable to save your request right now.");
      }
    } finally {
      window.clearTimeout(timer);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notify-me-title"
      className={`fixed inset-0 z-[80] transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button type="button" aria-label="Close" className="absolute inset-0 bg-[rgba(21,18,15,0.42)]" onClick={onClose} />

      <div className="absolute inset-0 flex items-end justify-center px-4 pb-4 sm:items-center sm:p-6">
        <div className="relative w-full max-w-[460px] rounded-[24px] bg-[#f7f1e8] p-6 shadow-[0_24px_60px_rgba(21,18,15,0.22)] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#8f7a65]">Notify Me</p>
              <h2 id="notify-me-title" className="mt-2 font-serif text-[22px] leading-[1.18] tracking-[-0.02em] text-[#1f1a16] sm:text-[24px]">
                We&rsquo;ll let you know when it returns
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 -mt-1 p-2 text-[11px] uppercase tracking-[0.18em] text-[#5b5247] hover:text-[#2e4a36] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7b68] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
            >
              Close
            </button>
          </div>

          <p className="mt-4 text-[13px] leading-[1.82] text-[#5f574d]">
            A quiet note for <span className="text-[#1f1a16]">{item.title}</span>. We&rsquo;ll reach out as soon as it&rsquo;s back in stock.
          </p>

          {status === "success" ? (
            <p className="mt-6 rounded-[14px] bg-[#eef6ed] px-4 py-4 text-[14px] leading-[1.8] text-[#2c6541]">
              You&rsquo;re on the list. We&rsquo;ll be in touch.
            </p>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label htmlFor="notify-me-email" className="sr-only">
                Your email address
              </label>
              <input
                id="notify-me-email"
                ref={emailInputRef}
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                autoComplete="email"
                className="w-full rounded-[14px] border border-[rgba(86,76,64,0.14)] bg-white px-4 py-3 text-[15px] text-[#1f1a16] outline-none transition-colors focus:border-[#2e4a36] focus:ring-2 focus:ring-[#2e4a36]/15"
              />

              {errorMessage ? (
                <p className="text-[13px] leading-[1.8] text-[#9f4332]">{errorMessage}</p>
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] leading-[1.6] text-[#8a8175]">
                  We&rsquo;ll only use this to tell you about this object.
                </p>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#294536] px-6 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f4efe8] transition-colors duration-200 hover:bg-[#21382c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8c7b68] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8] disabled:cursor-not-allowed disabled:bg-[#a8a095] disabled:text-[#f4efe8]/90"
                >
                  {status === "submitting" ? "Saving" : "Notify Me"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
