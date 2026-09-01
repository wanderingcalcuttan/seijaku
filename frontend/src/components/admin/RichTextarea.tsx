"use client";

import { useRef, useState } from "react";
import { Bold, Italic, Heading, List, Link } from "lucide-react";
import MarkdownPreview from "@/src/components/admin/MarkdownPreview";

type RichTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

export default function RichTextarea({
  value,
  onChange,
  rows = 8,
  placeholder = "Write detailed description in Markdown...",
}: RichTextareaProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (formatType: "bold" | "italic" | "heading" | "list" | "link") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";
    let cursorOffset = 0;

    switch (formatType) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        cursorOffset = selectedText ? 0 : 2;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        cursorOffset = selectedText ? 0 : 1;
        break;
      case "heading":
        // Ensure heading is on a new line
        const needsPreNewline = start > 0 && text.charAt(start - 1) !== "\n";
        replacement = `${needsPreNewline ? "\n" : ""}### ${selectedText || "Heading"}\n`;
        cursorOffset = selectedText ? 0 : 1; // puts cursor after newline
        break;
      case "list":
        const needsListPreNewline = start > 0 && text.charAt(start - 1) !== "\n";
        replacement = `${needsListPreNewline ? "\n" : ""}- ${selectedText || "list item"}`;
        cursorOffset = selectedText ? 0 : 0;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](https://)`;
        cursorOffset = selectedText ? 0 : 11; // highlights URL destination if empty
        break;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        const newPos = start + replacement.length;
        textarea.setSelectionRange(newPos, newPos);
      } else {
        const newPos = start + replacement.length - cursorOffset;
        textarea.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  return (
    <div className="w-full rounded-2xl border border-[#d7cec1] bg-white overflow-hidden focus-within:border-[#365b3f] focus-within:ring-2 focus-within:ring-[#365b3f]/15 transition">
      {/* Toolbar / Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#e2d7c7] bg-[#faf8f5] px-3 py-2">
        {/* Formatting Actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => insertFormat("bold")}
            disabled={activeTab === "preview"}
            className="rounded p-1.5 text-[#5b5247] hover:bg-[#e2d7c7]/40 disabled:opacity-50"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat("italic")}
            disabled={activeTab === "preview"}
            className="rounded p-1.5 text-[#5b5247] hover:bg-[#e2d7c7]/40 disabled:opacity-50"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat("heading")}
            disabled={activeTab === "preview"}
            className="rounded p-1.5 text-[#5b5247] hover:bg-[#e2d7c7]/40 disabled:opacity-50"
            title="Heading"
          >
            <Heading className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat("list")}
            disabled={activeTab === "preview"}
            className="rounded p-1.5 text-[#5b5247] hover:bg-[#e2d7c7]/40 disabled:opacity-50"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormat("link")}
            disabled={activeTab === "preview"}
            className="rounded p-1.5 text-[#5b5247] hover:bg-[#e2d7c7]/40 disabled:opacity-50"
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-lg bg-[#e2d7c7]/30 p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`rounded-md px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] transition-all ${
              activeTab === "edit"
                ? "bg-white text-[#2f2a26] shadow-sm"
                : "text-[#786c5f] hover:text-[#2f2a26]"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`rounded-md px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] transition-all ${
              activeTab === "preview"
                ? "bg-white text-[#2f2a26] shadow-sm"
                : "text-[#786c5f] hover:text-[#2f2a26]"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        {activeTab === "edit" ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border-0 bg-transparent px-4 py-3 text-[14px] leading-[1.7] text-[#2f2a26] outline-none placeholder-[#a69888]"
          />
        ) : (
          <div
            style={{ minHeight: `${rows * 26 + 24}px` }}
            className="w-full overflow-y-auto px-4 py-3 bg-[#faf8f5]/40 prose prose-stone max-w-none"
          >
            {value.trim() ? (
              <MarkdownPreview value={value} />
            ) : (
              <p className="text-[14px] italic text-[#a69888]">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
