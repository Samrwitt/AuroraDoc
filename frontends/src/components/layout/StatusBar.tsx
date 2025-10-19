import { CheckCircle2, Wifi, Clock, FileText, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StatusBarProps {
  isSaving?: boolean;
  lastSaved?: Date | null;
  wordCount?: number;
}

export const StatusBar = ({ isSaving, lastSaved, wordCount = 0 }: StatusBarProps) => {
  const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute

  const getSaveStatus = () => {
    if (isSaving) {
      return (
        <div className="flex items-center gap-1.5">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Saving...</span>
        </div>
      );
    }

    if (lastSaved) {
      return (
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3 text-status-success" />
          <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
        <span>Not saved yet</span>
      </div>
    );
  };

  return (
    <footer className="h-8 border-t bg-background flex items-center justify-between px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        {getSaveStatus()}
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <Wifi className="h-3 w-3" />
          <span>Connected</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span>{wordCount.toLocaleString()} words</span>
        <div className="h-3 w-px bg-border" />
        <span>~{readingTime} min read</span>
        <div className="h-3 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <span className="text-status-success">●</span>
          <span>LaTeX ready</span>
        </div>
      </div>
    </footer>
  );
};
