import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar } from "lucide-react";

const Admin = () => {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    date: "",
    answers: [
      { rank: 1, name: "", aliases: "" },
      { rank: 2, name: "", aliases: "" },
      { rank: 3, name: "", aliases: "" },
      { rank: 4, name: "", aliases: "" },
      { rank: 5, name: "", aliases: "" },
      { rank: 6, name: "", aliases: "" },
    ],
    hints: [
      { rank: 1, text: "" },
      { rank: 2, text: "" },
      { rank: 3, text: "" },
      { rank: 4, text: "" },
      { rank: 5, text: "" },
      { rank: 6, text: "" },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quiz data:", quizData);
  };

  const updateAnswer = (rank: number, field: 'name' | 'aliases', value: string) => {
    setQuizData(prev => ({
      ...prev,
      answers: prev.answers.map(a => 
        a.rank === rank ? { ...a, [field]: value } : a
      )
    }));
  };

  const updateHint = (rank: number, text: string) => {
    setQuizData(prev => ({
      ...prev,
      hints: prev.hints.map(h => 
        h.rank === rank ? { ...h, text } : h
      )
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">
              Create and manage daily quizzes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Quiz Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., All-Time Scoring Leaders"
                    value={quizData.title}
                    onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Name the top 6 scorers in NBA history"
                    value={quizData.description}
                    onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="date">Schedule Date</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      value={quizData.date}
                      onChange={(e) => setQuizData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Answers (Ranked)</h2>
              <div className="space-y-4">
                {quizData.answers.map((answer) => (
                  <div key={answer.rank} className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {answer.rank}
                      </span>
                      <span className="font-semibold">Rank #{answer.rank}</span>
                    </div>
                    
                    <div>
                      <Label>Player Name</Label>
                      <Input
                        placeholder="e.g., LeBron James"
                        value={answer.name}
                        onChange={(e) => updateAnswer(answer.rank, 'name', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Aliases (comma-separated)</Label>
                      <Input
                        placeholder="e.g., lebron, lbj, king james"
                        value={answer.aliases}
                        onChange={(e) => updateAnswer(answer.rank, 'aliases', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Hints</h2>
              <div className="space-y-4">
                {quizData.hints.map((hint) => (
                  <div key={hint.rank} className="space-y-2">
                    <Label>Hint for Rank #{hint.rank}</Label>
                    <Textarea
                      placeholder="e.g., Active player, entered league in 2003"
                      value={hint.text}
                      onChange={(e) => updateHint(hint.rank, e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
              <Button type="button" variant="outline" size="lg">
                Preview
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
