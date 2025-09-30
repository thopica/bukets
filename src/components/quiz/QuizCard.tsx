import { Card } from "@/components/ui/card";
import { Trophy, Calendar } from "lucide-react";

interface QuizCardProps {
  title: string;
  description: string;
  date: string;
}

const QuizCard = ({ title, description, date }: QuizCardProps) => {
  return (
    <Card className="p-3 bg-white shadow-xl border-0 rounded-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Trophy className="h-4 w-4 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{title}</h2>
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
          <Calendar className="h-3 w-3" />
          <span>{date}</span>
        </div>
      </div>
    </Card>
  );
};

export default QuizCard;
