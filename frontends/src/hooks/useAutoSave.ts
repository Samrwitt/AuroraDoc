import { useEffect, useRef, useState } from "react";
import { useEditor } from "@tiptap/react";
import { convertToLatex } from "@/lib/latex-converter";
import { toast } from "sonner";

interface AutoSaveOptions {
  editor: ReturnType<typeof useEditor>;
  documentId: string;
  delay?: number;
}

export const useAutoSave = ({ editor, documentId, delay = 2000 }: AutoSaveOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for auto-save
      timeoutRef.current = setTimeout(() => {
        saveDocument();
      }, delay);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [editor, documentId, delay]);

  const saveDocument = async () => {
    if (!editor) return;

    setIsSaving(true);

    try {
      const html = editor.getHTML();
      const latex = convertToLatex(html);

      // Save to localStorage (replace with backend API call later)
      localStorage.setItem(`doc-${documentId}-html`, html);
      localStorage.setItem(`doc-${documentId}-latex`, latex);
      localStorage.setItem(`doc-${documentId}-lastSaved`, new Date().toISOString());

      setLastSaved(new Date());
    } catch (error) {
      console.error("Auto-save failed:", error);
      toast.error("Failed to save document");
    } finally {
      setIsSaving(false);
    }
  };

  const loadDocument = () => {
    if (!editor) return;

    const html = localStorage.getItem(`doc-${documentId}-html`);
    const lastSavedStr = localStorage.getItem(`doc-${documentId}-lastSaved`);

    if (html) {
      editor.commands.setContent(html);
      if (lastSavedStr) {
        setLastSaved(new Date(lastSavedStr));
      }
    }
  };

  const getLatex = (): string => {
    return localStorage.getItem(`doc-${documentId}-latex`) || "";
  };

  return {
    isSaving,
    lastSaved,
    saveDocument,
    loadDocument,
    getLatex,
  };
};
