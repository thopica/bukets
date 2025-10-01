import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Trophy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const DUMMY_ARCHIVE = [
  {
    id: 1,
    date: "January 8, 2025",
    title: "All-Time Assists Leaders",
    completed: true,
    score: 18,
    correctAnswers: 6,
  },
  {
    id: 2,
    date: "January 7, 2025",
    title: "Single-Season 3-Point Leaders",
    completed: true,
    score: 15,
    correctAnswers: 5,
  },
  {
    id: 3,
    date: "January 6, 2025",
    title: "Career Rebounds Leaders",
    completed: false,
    score: 0,
    correctAnswers: 0,
  },
  {
    id: 4,
    date: "January 5, 2025",
    title: "MVP Winners (2000s)",
    completed: true,
    score: 17,
    correctAnswers: 6,
  },
  {
    id: 5,
    date: "January 4, 2025",
    title: "All-Time Blocks Leaders",
    completed: false,
    score: 0,
    correctAnswers: 0,
  },
];

const ArchiveSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-48" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-10 w-20 rounded-lg" />
          </div>
        </Card>
      ))}
    </div>
  );
};

const Archive = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Quiz Archive</h1>
            <p className="text-muted-foreground">
              Review past quizzes and replay missed challenges
            </p>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <ArchiveSkeleton />
            ) : (
              DUMMY_ARCHIVE.map((quiz) => (
                <Card key={quiz.id} className="p-4 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{quiz.date}</span>
                      </div>
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                      
                      {quiz.completed && (
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1 text-success">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>{quiz.correctAnswers}/6 correct</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-secondary" />
                            <span className="font-semibold">{quiz.score} points</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button variant={quiz.completed ? "outline" : "default"}>
                      {quiz.completed ? "Review" : "Play"}
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Archive;
