import { useState } from "react";
import { ChevronRight, MessageSquare, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  resolved: boolean;
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: "Jane Doe",
    content: "Should we add more citations here?",
    timestamp: "2 hours ago",
    resolved: false,
  },
  {
    id: "2",
    author: "John Smith",
    content: "The methodology section needs clarification.",
    timestamp: "5 hours ago",
    resolved: false,
  },
];

interface RightSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const RightSidebar = ({ isCollapsed, onToggle }: RightSidebarProps) => {
  return (
    <div
      className={cn(
        "border-l bg-editor-sidebar transition-all duration-300 flex flex-col h-full",
        isCollapsed ? "w-0 overflow-hidden" : "w-80"
      )}
    >
      <div className="h-10 border-b flex items-center justify-between px-3">
        <span className="text-sm font-medium">Activity</span>
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-7 w-7">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="comments" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b bg-transparent h-10 p-0">
          <TabsTrigger value="comments" className="flex-1 rounded-none data-[state=active]:bg-accent">
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="inspector" className="flex-1 rounded-none data-[state=active]:bg-accent">
            <Settings2 className="h-4 w-4 mr-1.5" />
            Inspector
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="flex-1 m-0 p-3">
          <ScrollArea className="h-full">
            <div className="space-y-3">
              {mockComments.map((comment) => (
                <div key={comment.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {comment.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{comment.author}</p>
                      <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-2">{comment.content}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Reply
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="inspector" className="flex-1 m-0 p-3">
          <div className="text-sm text-muted-foreground">
            <p className="mb-4">Select an element to view its properties</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground">Document Type</label>
                <p className="text-sm mt-1">Academic Paper</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Template</label>
                <p className="text-sm mt-1">IEEE Conference</p>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Word Count</label>
                <p className="text-sm mt-1">1,247 words</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
