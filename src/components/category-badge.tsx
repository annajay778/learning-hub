import { Badge } from "@/components/ui/badge";

export function CategoryBadge({
  name,
  color,
}: {
  name: string | null;
  color: string | null;
}) {
  if (!name) return null;

  return (
    <Badge
      variant="secondary"
      className="text-xs font-medium"
      style={{
        backgroundColor: color ? `${color}20` : undefined,
        color: color || undefined,
        borderColor: color ? `${color}40` : undefined,
      }}
    >
      {name}
    </Badge>
  );
}
