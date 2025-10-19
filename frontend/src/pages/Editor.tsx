import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { EditorToolbar } from "@/components/layout/EditorToolbar";
import { EditorCanvas, useAcademicEditor } from "@/components/layout/EditorCanvas";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { StatusBar } from "@/components/layout/StatusBar";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { useAutoSave } from "@/hooks/useAutoSave";
import { downloadLatex } from "@/lib/latex-converter";
import { toast } from "sonner";

const Editor = () => {
  const { id } = useParams();
  const documentId = id || "1";
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const editor = useAcademicEditor();

  const { isSaving, lastSaved, loadDocument, getLatex } = useAutoSave({
    editor,
    documentId,
  });

  // Load document on mount
  useEffect(() => {
    if (editor) {
      loadDocument();
    }
  }, [editor]);

  // Update word count when editor content changes
  useEffect(() => {
    if (!editor) return;

    const updateWordCount = () => {
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    };

    updateWordCount();
    editor.on("update", updateWordCount);

    return () => {
      editor.off("update", updateWordCount);
    };
  }, [editor]);

  const handleDownloadLatex = () => {
    const latex = getLatex();
    if (latex) {
      downloadLatex(latex, "document.tex");
      toast.success("LaTeX file downloaded");
    } else {
      toast.error("No content to export");
    }
  };

  const handleDownloadPdf = () => {
    toast.info("PDF compilation coming soon!");
  };

  return (
    <div className="h-screen flex flex-col">
      <TopBar 
        projectName="Neural Networks in Academic Writing" 
        onDownloadLatex={handleDownloadLatex}
        onDownloadPdf={handleDownloadPdf}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        <LeftSidebar 
          isCollapsed={leftSidebarCollapsed} 
          onToggle={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)} 
        />
        
        {leftSidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-2 z-10 h-8 w-8"
            onClick={() => setLeftSidebarCollapsed(false)}
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <EditorToolbar editor={editor} />
          <EditorCanvas editor={editor} />
        </div>

        {rightSidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 h-8 w-8"
            onClick={() => setRightSidebarCollapsed(false)}
          >
            <PanelRightOpen className="h-4 w-4" />
          </Button>
        )}

        <RightSidebar 
          isCollapsed={rightSidebarCollapsed} 
          onToggle={() => setRightSidebarCollapsed(!rightSidebarCollapsed)} 
        />
      </div>

      <StatusBar isSaving={isSaving} lastSaved={lastSaved} wordCount={wordCount} />
    </div>
  );
};

export default Editor;
