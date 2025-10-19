import { 
  Bold, Italic, Underline, Link as LinkIcon, Code, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Image, Table, Plus, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditor } from "@tiptap/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditorToolbarProps {
  editor: ReturnType<typeof useEditor>;
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) {
    return null;
  }

  const handleHeadingChange = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else if (value === "quote") {
      editor.chain().focus().toggleBlockquote().run();
    } else {
      const level = parseInt(value.replace("h", "")) as 1 | 2 | 3 | 4 | 5 | 6;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setLinkDialogOpen(false);
    }
  };

  const getCurrentHeading = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    if (editor.isActive("blockquote")) return "quote";
    return "paragraph";
  };

  return (
    <>
      <div className="h-12 border-b bg-editor-toolbar flex items-center px-4 gap-1 overflow-x-auto">
        {/* Heading Level */}
        <Select value={getCurrentHeading()} onValueChange={handleHeadingChange}>
          <SelectTrigger className="w-32 h-8 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Formatting */}
        <div className="flex gap-0.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive("bold") ? "bg-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive("italic") ? "bg-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive("underline") ? "bg-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive("code") ? "bg-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive("link") ? "bg-accent" : ""}`}
            onClick={() => setLinkDialogOpen(true)}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Alignment */}
        <div className="flex gap-0.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}`}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}`}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}`}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists */}
        <div className="flex gap-0.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive("bulletList") ? "bg-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-8 w-8 ${editor.isActive("orderedList") ? "bg-accent" : ""}`}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Insert */}
        <div className="flex gap-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Table className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setLink();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={setLink}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
