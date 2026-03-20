import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownViewer({ content }: { content: string }) {
  if (!content) {
    return (
      <p className="text-sm italic text-muted-foreground">No content yet.</p>
    );
  }

  return (
    <div className="prose prose-neutral max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-primary">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
