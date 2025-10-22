import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, MessageSquare, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Feedback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);

  const maxLength = 1000;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }

    if (feedback.length > maxLength) {
      toast.error(`Feedback must be ${maxLength} characters or less`);
      return;
    }

    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          feedback_text: feedback.trim()
        });

      if (error) throw error;

      toast.success("Thank you for your feedback!");
      setSubmitted(true);
      setFeedback("");
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-2">Feedback</h1>
            <p className="text-muted-foreground">
              Help us improve by sharing your thoughts, suggestions, or reporting issues
            </p>
          </div>

          {submitted ? (
            <Card className="p-8 text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
              </p>
              <Button onClick={() => setSubmitted(false)}>
                Submit Another Feedback
              </Button>
            </Card>
          ) : (
            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="feedback">
                    Your Feedback
                  </Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you like, what needs improvement, or any feature requests you have..."
                    className="min-h-[200px] resize-none"
                    maxLength={maxLength}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Share your thoughts, suggestions, or report issues</span>
                    <span>{feedback.length}/{maxLength}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={submitting || !feedback.trim()}
                    className="flex-1"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-2">What kind of feedback are we looking for?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• What features do you enjoy most?</li>
              <li>• What could be improved or is confusing?</li>
              <li>• New features you'd like to see</li>
              <li>• Bug reports or technical issues</li>
              <li>• General suggestions for the game</li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
