import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Hand-rolled prose styles via arbitrary descendant selectors. Project is on
// Tailwind v4; we deliberately avoid pulling in @tailwindcss/typography just
// for one editorial route — the per-element rules below cover headings,
// paragraphs, lists, blockquotes, links, and inline emphasis/code.
//
// react-markdown defaults to safe HTML — raw HTML inside the markdown is
// escaped, not rendered. We do NOT enable rehype-raw. Admin content is
// editor-trusted but XSS containment stays.
const PROSE_CLASSES = [
  // "max-w-[68ch]",
  "text-[16px] leading-[1.85] text-[#3a3329]",
  // Paragraphs
  "[&_p]:mt-6 [&_p]:first:mt-0",
  // Headings
  "[&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-[clamp(24px,2.6vw,32px)] [&_h2]:leading-[1.18] [&_h2]:tracking-[-0.02em] [&_h2]:text-[#1d1a17]",
  "[&_h3]:mt-10 [&_h3]:font-serif [&_h3]:text-[clamp(20px,2vw,24px)] [&_h3]:leading-[1.24] [&_h3]:tracking-[-0.015em] [&_h3]:text-[#1d1a17]",
  "[&_h4]:mt-8 [&_h4]:text-[15px] [&_h4]:font-medium [&_h4]:uppercase [&_h4]:tracking-[0.18em] [&_h4]:text-[#7a6a55]",
  // Lists
  "[&_ul]:mt-6 [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:marker:text-[#9a785d]",
  "[&_ol]:mt-6 [&_ol]:pl-6 [&_ol]:list-decimal [&_ol]:marker:text-[#9a785d]",
  "[&_li]:mt-2 [&_li_>_p]:mt-0",
  // Blockquote
  "[&_blockquote]:mt-8 [&_blockquote]:border-l-2 [&_blockquote]:border-[#9a785d] [&_blockquote]:pl-6 [&_blockquote]:font-serif [&_blockquote]:text-[19px] [&_blockquote]:leading-[1.6] [&_blockquote]:italic [&_blockquote]:text-[#5b5246]",
  // Links
  "[&_a]:text-[#2e4a36] [&_a]:underline [&_a]:decoration-[#2e4a36]/30 [&_a]:underline-offset-4 hover:[&_a]:decoration-[#2e4a36]",
  // Emphasis + code
  "[&_strong]:font-semibold [&_strong]:text-[#1d1a17]",
  "[&_em]:italic",
  "[&_code]:rounded [&_code]:bg-[#f0e9dc] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[14px] [&_code]:text-[#3a3329]",
  // Horizontal rule
  "[&_hr]:my-12 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-[#d8cec1]",
  // Tables (gfm)
  "[&_table]:mt-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-[14px]",
  "[&_th]:border [&_th]:border-[#d8cec1] [&_th]:bg-[#faf6ee] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left",
  "[&_td]:border [&_td]:border-[#d8cec1] [&_td]:px-3 [&_td]:py-2",
].join(" ");

type ArticleBodyProps = {
  markdown: string | null | undefined;
};

export default function ArticleBody({ markdown }: ArticleBodyProps) {
  if (!markdown || markdown.trim().length === 0) return null;
  return (
    <div className={PROSE_CLASSES}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
