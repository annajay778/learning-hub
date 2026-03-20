import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Terminal,
  Users,
  Zap,
  Search,
  Handshake,
  AlertTriangle,
  Layers,
} from "lucide-react";
import type { Module } from "@/lib/modules";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  terminal: Terminal,
  users: Users,
  zap: Zap,
  search: Search,
  handshake: Handshake,
  "alert-triangle": AlertTriangle,
  layers: Layers,
};

interface ModuleCardProps {
  module: Module;
  pageCount: number;
  index: number;
}

export function ModuleCard({ module, pageCount, index }: ModuleCardProps) {
  const Icon = iconMap[module.icon] || Layers;

  return (
    <Link href={`/learn/${module.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="space-y-2 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-semibold leading-snug">
                {index + 1}. {module.title}
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                {module.description}
              </CardDescription>
              <p className="mt-2 text-xs text-muted-foreground">
                {pageCount} {pageCount === 1 ? "page" : "pages"}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
