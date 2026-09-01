"use client";

import { useState, useTransition } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNum, setOrderNum] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      setNotice(null);
      setError(null);

      // Simulate a premium organic form submission delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setNotice("Thank you for your message. We have received it and will get back to you within 24 to 48 hours.");
      setName("");
      setEmail("");
      setOrderNum("");
      setSubject("");
      setMessage("");
    });
  };

  const inputClass =
    "w-full rounded-[14px] border border-[#cfc3b4]/60 bg-[#faf8f4]/40 px-4 py-3 text-[14px] text-[#2f2924] outline-none transition-all focus:border-[#365b3f] focus:bg-white focus:ring-2 focus:ring-[#365b3f]/10 disabled:opacity-60";

  return (
    <div className="rounded-[24px] border border-black/5 bg-white p-6 sm:p-10 shadow-sm">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a785d]">Send a Message</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7c7368]">
              Name *
            </label>
            <input
              type="text"
              required
              disabled={isPending}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7c7368]">
              Email Address *
            </label>
            <input
              type="email"
              required
              disabled={isPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7c7368]">
            Order Number
          </label>
          <input
            type="text"
            disabled={isPending}
            value={orderNum}
            onChange={(e) => setOrderNum(e.target.value)}
            placeholder="Optional"
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7c7368]">
            Subject *
          </label>
          <select
            required
            disabled={isPending}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass}
          >
            <option value="">Select a subject...</option>
            <option value="support">Customer Support &amp; Orders</option>
            <option value="wholesale">Wholesale &amp; Business</option>
            <option value="technical">Website Feedback</option>
            <option value="other">Other Queries</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7c7368]">
            Message *
          </label>
          <textarea
            required
            rows={5}
            disabled={isPending}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you need help with..."
            className={`${inputClass} resize-none leading-[1.6]`}
          />
        </div>

        {notice && (
          <div className="rounded-[14px] bg-[#eef8f0] border border-[#cde0d2] p-4 text-[13px] text-[#2c6541] leading-relaxed">
            {notice}
          </div>
        )}

        {error && (
          <div className="rounded-[14px] bg-[#fff1ee] border border-[#e7c1ba] p-4 text-[13px] text-[#9f4332] leading-relaxed">
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto rounded-[12px] bg-[#1d1a17] px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.12em] text-[#f4efe8] transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-[#a8a095]"
          >
            {isPending ? "Sending..." : "Send Message"}
          </button>
        </div>

        <p className="text-[10px] tracking-[0.05em] uppercase text-[#8a8378] text-center pt-2">
          For urgent inquiries, WhatsApp us at +91-9432804418
        </p>
      </form>
    </div>
  );
}
