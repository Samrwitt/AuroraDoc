"use client";

import { EditorContent } from "@tiptap/react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EditorCanvas({ editor }: { editor: ReturnType<typeof import("@tiptap/react").useEditor> }) {
  if (!editor) return null;

  return (
    // Use direct HSL token to avoid relying on a Tailwind token for the bg
    <ScrollArea className="flex-1 bg-[hsl(var(--editor-bg))]">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="min-h-screen bg-card rounded-lg shadow-sm border p-12">
          <EditorContent editor={editor} className="prose prose-slate dark:prose-invert max-w-none focus:outline-none" />
        </div>
      </div>
    </ScrollArea>
  );
}
