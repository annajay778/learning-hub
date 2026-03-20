"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCategory } from "@/lib/actions";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryPickerProps {
  categories: Category[];
  value: string | null;
  onChange: (categoryId: string | null) => void;
}

export function CategoryPicker({
  categories,
  value,
  onChange,
}: CategoryPickerProps) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  async function handleAdd() {
    if (!newName.trim()) return;
    const formData = new FormData();
    formData.set("name", newName.trim());
    const result = await createCategory(formData);
    if (result.category) {
      onChange(result.category.id);
      setNewName("");
      setAdding(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Category</label>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            value === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:bg-accent"
          }`}
        >
          None
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              value === cat.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-accent"
            }`}
            style={
              value === cat.id
                ? {}
                : { borderColor: `${cat.color}40`, color: cat.color }
            }
          >
            {cat.name}
          </button>
        ))}
        {adding ? (
          <div className="flex items-center gap-1">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              className="h-7 w-32 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
                if (e.key === "Escape") setAdding(false);
              }}
              autoFocus
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleAdd}
              className="h-7 px-2 text-xs"
            >
              Add
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
          >
            <Plus className="h-3 w-3" /> New
          </button>
        )}
      </div>
      {value && (
        <input type="hidden" name="categoryId" value={value} />
      )}
    </div>
  );
}
