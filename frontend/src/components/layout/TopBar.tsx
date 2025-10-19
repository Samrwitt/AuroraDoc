import { FileText, Share2, User, Bell, Download, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  projectName?: string;
  onDownloadLatex?: () => void;
  onDownloadPdf?: () => void;
}

export const TopBar = ({ 
  projectName = "Untitled Document",
  onDownloadLatex,
  onDownloadPdf 
}: TopBarProps) => {
  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-50">
      {/* Left: Logo & Project */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">AuroraDoc</span>
        </div>
        <div className="h-6 w-px bg-border" />
        <span className="text-sm font-medium text-foreground">{projectName}</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuItem onClick={onDownloadLatex}>
              <FileCode className="h-4 w-4 mr-2" />
              Download LaTeX (.tex)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadPdf}>
              <Download className="h-4 w-4 mr-2" />
              Compile & Download PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
