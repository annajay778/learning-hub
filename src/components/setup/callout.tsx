import { Lightbulb, AlertTriangle, Info, CheckCircle2, Bot, Clock } from "lucide-react";

const STYLES = {
  tip: {
    border: "border-l-blue-500",
    bg: "bg-blue-500/10",
    icon: Lightbulb,
    iconColor: "text-blue-500",
  },
  warning: {
    border: "border-l-amber-500",
    bg: "bg-amber-500/10",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  info: {
    border: "border-l-purple-500",
    bg: "bg-purple-500/10",
    icon: Info,
    iconColor: "text-purple-500",
  },
  success: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/10",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
  claude: {
    border: "border-l-orange-500",
    bg: "bg-orange-500/10",
    icon: Bot,
    iconColor: "text-orange-500",
  },
  time: {
    border: "border-l-slate-400",
    bg: "bg-slate-400/10",
    icon: Clock,
    iconColor: "text-slate-500",
  },
} as const;

interface CalloutProps {
  type: keyof typeof STYLES;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type, title, children }: CalloutProps) {
  const style = STYLES[type];
  const Icon = style.icon;

  return (
    <div
      className={`rounded-r-lg border-l-4 ${style.border} ${style.bg} px-4 py-3`}
    >
      <div className="flex items-start gap-2.5">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.iconColor}`} />
        <div className="text-sm leading-relaxed text-[var(--s-text-body)]">
          {title && (
            <span className="mb-1 block font-semibold text-[var(--s-text)]">
              {title}
            </span>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
