import { useState } from "react";
import { ChevronLeft, FileText, Image, BookOpen, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface OutlineNode {
  id: string;
  title: string;
  level: number;
  children?: OutlineNode[];
}

const mockOutline: OutlineNode[] = [
  {
    id: "1",
    title: "Abstract",
    level: 1,
  },
  {
    id: "2",
    title: "Introduction",
    level: 1,
    children: [
      { id: "2.1", title: "Background", level: 2 },
      { id: "2.2", title: "Motivation", level: 2 },
    ],
  },
  {
    id: "3",
    title: "Methods",
    level: 1,
    children: [
      { id: "3.1", title: "Data Collection", level: 2 },
      { id: "3.2", title: "Analysis", level: 2 },
    ],
  },
  {
    id: "4",
    title: "Results",
    level: 1,
  },
  {
    id: "5",
    title: "Discussion",
    level: 1,
  },
];

const OutlineItem = ({ node }: { node: OutlineNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent/50 text-sm group",
          node.level === 2 && "pl-6"
        )}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )
        ) : (
          <div className="w-3" />
        )}
        <span className={cn(node.level === 1 && "font-medium")}>{node.title}</span>
      </button>
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {node.children?.map((child) => (
            <OutlineItem key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

interface LeftSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const LeftSidebar = ({ isCollapsed, onToggle }: LeftSidebarProps) => {
  return (
    <div
      className={cn(
        "border-r bg-editor-sidebar transition-all duration-300 flex flex-col h-full",
        isCollapsed ? "w-0 overflow-hidden" : "w-64"
      )}
    >
      <div className="h-10 border-b flex items-center justify-between px-3">
        <span className="text-sm font-medium">Navigation</span>
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="outline" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b bg-transparent h-10 p-0">
          <TabsTrigger value="outline" className="flex-1 rounded-none data-[state=active]:bg-accent">
            <FileText className="h-4 w-4 mr-1.5" />
            Outline
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex-1 rounded-none data-[state=active]:bg-accent">
            <Image className="h-4 w-4 mr-1.5" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="citations" className="flex-1 rounded-none data-[state=active]:bg-accent">
            <BookOpen className="h-4 w-4 mr-1.5" />
            Citations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outline" className="flex-1 m-0 p-2">
          <ScrollArea className="h-full">
            {mockOutline.map((node) => (
              <OutlineItem key={node.id} node={node} />
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="assets" className="flex-1 m-0 p-3">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Assets in document:</p>
            <div className="space-y-2">
              <div className="p-2 rounded border bg-card hover:bg-accent/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  <span className="text-sm">figure1.png</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Used in: Methods</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="citations" className="flex-1 m-0 p-3">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Citation library:</p>
            <div className="space-y-2">
              <div className="p-2 rounded border bg-card hover:bg-accent/50 cursor-pointer">
                <p className="text-sm font-medium text-foreground">Smith et al. 2023</p>
                <p className="text-xs mt-1">Neural Networks in Academic Writing</p>
              </div>
              <div className="p-2 rounded border bg-card hover:bg-accent/50 cursor-pointer">
                <p className="text-sm font-medium text-foreground">Doe & Johnson 2022</p>
                <p className="text-xs mt-1">Collaborative Editing Systems</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
