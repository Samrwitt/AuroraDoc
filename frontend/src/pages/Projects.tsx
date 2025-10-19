import { Link } from "react-router-dom";
import { FileText, Plus, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Project {
  id: string;
  title: string;
  lastEdited: string;
  collaborators: string[];
  wordCount: number;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Neural Networks in Academic Writing",
    lastEdited: "2 hours ago",
    collaborators: ["JD", "MS"],
    wordCount: 1247,
  },
  {
    id: "2",
    title: "Machine Learning Survey Paper",
    lastEdited: "1 day ago",
    collaborators: ["JD"],
    wordCount: 3421,
  },
  {
    id: "3",
    title: "PhD Thesis Draft",
    lastEdited: "3 days ago",
    collaborators: ["JD", "MS", "AK"],
    wordCount: 12543,
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">AuroraDoc</h1>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Documents</h2>
          <p className="text-muted-foreground">Continue working on your research papers and articles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Link key={project.id} to={`/doc/${project.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">{project.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{project.lastEdited}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-1">
                    {project.collaborators.map((collab, idx) => (
                      <Avatar key={idx} className="h-6 w-6 border-2 border-background -ml-1 first:ml-0">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {collab}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {project.wordCount.toLocaleString()} words
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Projects;
