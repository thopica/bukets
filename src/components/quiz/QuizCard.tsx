import { Card } from "@/components/ui/card";
import { Trophy, Calendar } from "lucide-react";

interface QuizCardProps {
  title: string;
  description: string;
  date: string;
}

const QuizCard = ({ title, description, date }: QuizCardProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-2 shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-secondary" />
            <span className="text-sm font-medium text-muted-foreground">Daily Challenge</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default QuizCard;
