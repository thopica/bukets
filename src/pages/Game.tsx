import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizHeader from "@/components/quiz/QuizHeader";
import AnswerGrid from "@/components/quiz/AnswerGrid";
import GuessInput from "@/components/quiz/GuessInput";
import HintBar from "@/components/quiz/HintBar";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/lib/api";
import { fetchTodaysQuiz, getQuizDateISO, type Quiz, type QuizMetadataResponse } from "@/utils/quizDate";
import type { User } from "@supabase/supabase-js";
import { useGameScore } from "@/hooks/useGameScore";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [initialHeight, setInitialHeight] = useState(window.innerHeight);

  // Lock initial viewport height for mobile shell - don't update on keyboard
  useEffect(() => {
    const height = window.innerHeight;
    setInitialHeight(height);
    document.documentElement.style.setProperty('--initial-vh', `${height * 0.01}px`);
    
    // Standard vh for desktop
    const setVH = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    
    // Only update on actual orientation/window resize, not keyboard
    const handleResize = () => {
      setVH(); // Always update --vh for desktop
      
      // Only update initial-vh if it's a significant change (orientation, window resize)
      if (Math.abs(window.innerHeight - height) > 100) {
        const newHeight = window.innerHeight;
        setInitialHeight(newHeight);
        document.documentElement.style.setProperty('--initial-vh', `${newHeight * 0.01}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Visual Viewport: track keyboard height and keep scroll anchored
  useEffect(() => {
    const onVVUpdate = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const diff = window.innerHeight - vv.height;
      setKeyboardHeight(diff > 0 ? diff : 0);

      // Preserve scroll position of the content area to avoid jumps
      const el = scrollRef.current;
      if (el) {
        const current = el.scrollTop;
        requestAnimationFrame(() => {
          el.scrollTop = current;
        });
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onVVUpdate);
      window.visualViewport.addEventListener('scroll', onVVUpdate);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onVVUpdate);
        window.visualViewport.removeEventListener('scroll', onVVUpdate);
      }
    };
  }, []);

  // Quiz metadata state
  const [quizData, setQuizData] = useState<QuizMetadataResponse | null>(null);
  const [quizIndex, setQuizIndex] = useState<number>(0);

  // State management for quiz game
  const [userAnswers, setUserAnswers] = useState<Array<{ rank: number; playerName?: string; isCorrect?: boolean; isRevealed?: boolean; stat?: string }>>([
    { rank: 1 },
    { rank: 2 },
    { rank: 3 },
    { rank: 4 },
    { rank: 5 },
    { rank: 6 },
  ]);
  
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | undefined>();
  // Per-player hint usage tracking (0-2 per rank)
  const [hintsUsedByRank, setHintsUsedByRank] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  // Track which rank the current hint belongs to (1-6)
  const [currentHintRank, setCurrentHintRank] = useState<number | undefined>(undefined);
  // Remember where we last targeted a hint so we can cycle to the next unanswered card
  const [lastHintTargetIndex, setLastHintTargetIndex] = useState<number>(-1);
  // Manage a single active timeout for hint display to avoid older timers clearing newer hints
  const hintTimeoutRef = useRef<number | null>(null);
  // timeRemaining state removed - using only overall timer now
  const [overallTimeRemaining, setOverallTimeRemaining] = useState(90);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [incorrectGuess, setIncorrectGuess] = useState<number | null>(null);
  const [lastGuessRank, setLastGuessRank] = useState<number | undefined>();
  const [showInputError, setShowInputError] = useState(false);
  const [showInputSuccess, setShowInputSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [answerTimings, setAnswerTimings] = useState<Map<number, { startTime: number; endTime?: number }>>(new Map());
  const [quizStartTime] = useState(Date.now());
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isCheckingCompletion, setIsCheckingCompletion] = useState(true);
  // initializedTurnTimer removed - no per-player timer anymore
  const scrollRef = useRef<HTMLDivElement>(null);
  const INPUT_BAR_HEIGHT = 72;
  
  // Track start time for current answer
  const [currentAnswerStartTime, setCurrentAnswerStartTime] = useState(Date.now());
  
  // Track last answer's points and time for AnswerGrid animation
  const [lastAnswerPoints, setLastAnswerPoints] = useState<number | undefined>();
  const [lastAnswerTime, setLastAnswerTime] = useState<number | undefined>();

  const maxHintsPerPlayer = 2;
  const totalQuizTime = 90; // 1:30 minutes in seconds

  // Fetch quiz metadata on mount
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const metadata = await fetchTodaysQuiz();
        setQuizData(metadata);
        setQuizIndex(metadata.index);
      } catch (error) {
        console.error('Failed to load quiz:', error);
        toast.error('Failed to load quiz. Please refresh the page.');
      }
    };

    loadQuiz();
  }, []);

  // Check authentication state and quiz completion
  useEffect(() => {
    if (!quizData) return; // Wait for quiz data to load

    const checkAccess = async () => {
      setIsCheckingCompletion(true);
      
      // Check auth
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (!session?.user) {
        // For non-logged-in users, just start the timer without session management
        setIsCheckingCompletion(false);
        return;
      }

      // Start or restore quiz session
      try {
        const today = getQuizDateISO();
        const { data: sessionData, error: sessionError } = await api.invoke('start-quiz-session', {
          body: {
            quiz_date: today,
            quiz_index: quizIndex
          }
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          setIsCheckingCompletion(false);
          return;
        }

        console.log('Quiz session data:', sessionData);

        // Already completed
        if (sessionData?.already_completed) {
          console.log('Redirecting to already-completed page');
          navigate('/already-completed', { replace: true });
          return;
        }

        // Session expired (time ran out before completing)
        if (sessionData?.session_expired) {
          const partialScore = sessionData.partial_score || 0;
          const correctGuesses = sessionData.correct_guesses || 0;
          const hintsUsed = sessionData.hints_used || 0;
          
          console.log(`Session expired - crediting ${partialScore} points for ${correctGuesses} correct answers`);
          
          toast.info(`Time expired! You earned ${partialScore} points for ${correctGuesses} correct answers.`);
          navigate('/results', {
            state: {
              total_score: partialScore,
              correct_guesses: correctGuesses,
              hints_used: hintsUsed,
              time_used: totalQuizTime,
              quiz_date: today,
              quiz_index: quizIndex,
              // answered_ranks unknown on expired restore here; Results will fetch from quiz_sessions if logged-in
            }
          });
          return;
        }

        // Restore existing session
        if (sessionData?.session_exists || sessionData?.session_started) {
          const remaining = sessionData.remaining_seconds || totalQuizTime;
          console.log(`Restoring quiz with ${remaining} seconds remaining`);
          setOverallTimeRemaining(remaining);
          
          // Per-turn timer removed - using only overall timer now
          
          // Restore saved progress
          if (typeof sessionData.saved_score === 'number') {
            setScore(sessionData.saved_score);
            console.log(`Restored score: ${sessionData.saved_score}`);
          }
          if (typeof sessionData.saved_hints === 'number') {
            // Keep total for analytics display if needed; per-rank distribution is unknown
            setHintsUsed(sessionData.saved_hints);
          }
          
          // Restore answered players (both correct and revealed)
          const correctRanks = sessionData.answered_ranks || [];
          const revealedRanks = sessionData.revealed_ranks || [];
          
          if (correctRanks.length > 0 || revealedRanks.length > 0) {
            console.log(`Restoring ${correctRanks.length} correct + ${revealedRanks.length} revealed players`);
            
            // Fetch the answers for these ranks
            const allRanks = [...correctRanks, ...revealedRanks];
            const answersToRestore = await Promise.all(
              allRanks.map(async (rank: number) => {
                const { data } = await api.invoke('verify-guess', {
                  body: { revealRank: rank }
                });
                return { ...data?.answer, isCorrect: correctRanks.includes(rank) };
              })
            );
            
            // Rebuild userAnswers with restored data
            const restoredAnswers = [...userAnswers];
            answersToRestore.forEach((answer: any) => {
              if (answer) {
                restoredAnswers[answer.rank - 1] = {
                  rank: answer.rank,
                  playerName: answer.name,
                  isCorrect: answer.isCorrect,
                  isRevealed: !answer.isCorrect,
                  stat: answer.stat,
                };
              }
            });
            setUserAnswers(restoredAnswers);
          }
        }
        
        // Timer initialization removed - using only overall timer now

      } catch (error) {
        console.error('Failed to initialize quiz session:', error);
      }
      
      setIsCheckingCompletion(false);
    };

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate, quizData, quizIndex]);

  // Initialize answer timings for all ranks
  useEffect(() => {
    const timings = new Map<number, { startTime: number; endTime?: number }>();
    for (let i = 1; i <= 6; i++) {
      timings.set(i, { startTime: Date.now() });
    }
    setAnswerTimings(timings);
    setCurrentAnswerStartTime(Date.now());
  }, []);

  // Per-player timer countdown - REMOVED
  // Now using only overall timer for better game experience

  // Overall quiz timer countdown
  useEffect(() => {
    if (isCompleted || overallTimeRemaining === 0) return;

    const overallTimer = setInterval(() => {
      setOverallTimeRemaining((prev) => {
        if (prev <= 1) {
          // End quiz when overall time is up - navigate to results
          setIsCompleted(true);
          
          const correctCount = userAnswers.filter((a) => a.isCorrect).length;
          
          navigate('/results', {
            state: {
              total_score: score,
              correct_guesses: correctCount,
              hints_used: totalHintsUsed,
              time_used: totalQuizTime,
              quiz_date: getQuizDateISO(),
              quiz_index: quizIndex,
              answered_ranks: userAnswers.filter(a => a.isCorrect).map(a => a.rank)
            }
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(overallTimer);
  }, [overallTimeRemaining, isCompleted, userAnswers, hintsUsed, score, navigate]);

  // Auto-save progress periodically to survive refreshes
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      // Only save progress if user is logged in
      if (!user) return;

      const answeredRanks = userAnswers.filter(a => a.isCorrect).map(a => a.rank);
      const revealedRanks = userAnswers.filter(a => a.isRevealed && !a.isCorrect).map(a => a.rank);
      const totalPerPlayerHints = hintsUsedByRank.reduce((a, b) => a + b, 0);
      if (answeredRanks.length > 0 || revealedRanks.length > 0 || totalPerPlayerHints > 0 || score > 0) {
        api.invoke('save-quiz-progress', {
          body: {
            quiz_date: getQuizDateISO(),
            current_score: score,
            correct_guesses: answeredRanks.length,
            hints_used: totalPerPlayerHints,
            answered_ranks: answeredRanks,
            revealed_ranks: revealedRanks,
          }
        }).catch(() => {});
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [userAnswers, hintsUsedByRank, score, isCompleted, user]);

  // handleTimeUp function removed - no more auto-reveals
  // Users now have full control over their 1:30 time

  const normalizeGuess = (guess: string) => {
    return guess.toLowerCase().trim().replace(/[^a-z\s]/g, '');
  };

  const checkGuess = async (guess: string) => {
    try {
      // Get already answered ranks
      const alreadyAnswered = userAnswers
        .filter(a => a.playerName)
        .map(a => a.rank);

      // Call server-side verification
      const { data, error } = await api.invoke('verify-guess', {
        body: {
          guess,
          quizIndex: undefined, // undefined = today's quiz
          alreadyAnswered
        }
      });

      if (error) {
        console.error('Verification error:', error);
        return null;
      }

      if (!data.correct) {
        return null;
      }

      // Check if already answered
      const slot = userAnswers[data.answer.rank - 1];
      if (slot?.playerName) {
        return slot.isCorrect ? "ALREADY_CORRECT" : "ALREADY_REVEALED";
      }

      return data.answer;
    } catch (error) {
      console.error('Error verifying guess:', error);
      return null;
    }
  };

  const calculateTimeBonus = (timeTaken: number) => {
    // Calculate time-based bonus points with inclusive boundaries
    if (timeTaken <= 10) {
      return 2; // +2 bonus for 5 total points (golden) - 0 to 10 seconds inclusive
    } else if (timeTaken <= 15) {
      return 1; // +1 bonus for 4 total points (orange) - 10.01 to 15 seconds inclusive
    } else {
      return 0; // +0 bonus for 3 total points (green) - 15+ seconds
    }
  };

  const handleGuess = async (guess: string) => {
    const result = await checkGuess(guess);
    
    if (typeof result === "string") {
      // Already correct or timed out - just return
      return;
    }
    
    const matchedAnswer = result;
    
    if (matchedAnswer) {
      // Calculate time taken for this answer
      const timeTaken = (Date.now() - currentAnswerStartTime) / 1000; // in seconds
      
      // Calculate base points (3) + time bonus
      const timeBonus = calculateTimeBonus(timeTaken);
      const basePoints = 3;
      const pointsBeforeHints = basePoints + timeBonus;
      // Apply hint penalty based on per-player hints used on this rank (0-2)
      const hintPenalty = hintsUsedByRank[matchedAnswer.rank - 1] || 0;
      const pointsEarned = Math.max(1, pointsBeforeHints - hintPenalty);
      
      // Store points and time for AnswerGrid animation
      setLastAnswerPoints(pointsEarned);
      setLastAnswerTime(timeTaken);
      
      const newAnswers = [...userAnswers];
      const index = matchedAnswer.rank - 1;
      newAnswers[index] = {
        rank: matchedAnswer.rank,
        playerName: matchedAnswer.name,
        isCorrect: true,
        stat: matchedAnswer.stat,
      };
      
      setUserAnswers(newAnswers);
      setScore((prev) => prev + pointsEarned);
      // Only clear the hint if the guessed rank is the one being hinted
      if (typeof currentHintRank === 'number' && currentHintRank === matchedAnswer.rank) {
        setCurrentHint(undefined);
        setCurrentHintRank(undefined);
        if (hintTimeoutRef.current) {
          clearTimeout(hintTimeoutRef.current);
          hintTimeoutRef.current = null;
        }
      }
      setIncorrectGuess(null);
      setLastGuessRank(matchedAnswer.rank);
      setShowInputError(false);
      setShowInputSuccess(true);
      
      // Reset timer for next answer
      setCurrentAnswerStartTime(Date.now());
      
      // Save progress to database after each correct answer
      const newScore = score + pointsEarned;
      const newCorrectCount = newAnswers.filter((a) => a.isCorrect).length;
      const answeredRanks = newAnswers
        .filter((a) => a.isCorrect)
        .map((a) => a.rank);
      const revealedRanks = newAnswers
        .filter((a) => a.isRevealed && !a.isCorrect)
        .map((a) => a.rank);
      const totalPerPlayerHints = hintsUsedByRank.reduce((a, b) => a + b, 0);
      
      // Only save progress for logged-in users
      if (user) {
        try {
          await api.invoke('save-quiz-progress', {
            body: {
              quiz_date: getQuizDateISO(),
              current_score: newScore,
              correct_guesses: newCorrectCount,
              hints_used: totalPerPlayerHints,
              answered_ranks: answeredRanks,
              revealed_ranks: revealedRanks,
              reset_turn: true
            }
          });
        } catch (err) {
          console.error('Failed to save progress:', err);
        }
      }
      
      // Track timing for this answer
      const timings = new Map(answerTimings);
      const answerTime = timings.get(matchedAnswer.rank);
      if (answerTime) {
        answerTime.endTime = Date.now();
        timings.set(matchedAnswer.rank, answerTime);
        setAnswerTimings(timings);
      }
      
      // Check if all answered
      const allCorrect = newAnswers.every((a) => a.isCorrect);
      if (allCorrect) {
        setIsCompleted(true);
        
        // Navigate to results page with score data
        const correctCount = newAnswers.filter((a) => a.isCorrect).length;
        const finalScore = score + pointsEarned; // Use updated score including this answer
        const finalTotalHints = hintsUsedByRank.reduce((a, b) => a + b, 0);
        
        navigate('/results', {
          state: {
            total_score: finalScore,
            correct_guesses: correctCount,
            hints_used: finalTotalHints,
            time_used: totalQuizTime - overallTimeRemaining,
            quiz_date: getQuizDateISO(),
            quiz_index: quizIndex,
            answered_ranks: newAnswers.filter(a => a.isCorrect).map(a => a.rank)
          }
        });
      }
    } else {
      setLastGuessRank(undefined);
      // Reset error state briefly to ensure animation triggers on every wrong guess
      setShowInputError(false);
      setShowInputSuccess(false);
      setTimeout(() => setShowInputError(true), 10);
    }
  };

  // Helper to get the target rank index (0-5) for the next hint press.
  // Prefer continuing on the current target if it still has hints and is unanswered; otherwise, advance to the next eligible unanswered card.
  const getTargetIndexForNextPress = (currentIndex: number) => {
    const isEligible = (idx: number) => {
      const answer = userAnswers[idx];
      const used = hintsUsedByRank[idx] || 0;
      return !answer.isCorrect && !answer.isRevealed && used < maxHintsPerPlayer;
    };

    if (currentIndex >= 0 && currentIndex < 6 && isEligible(currentIndex)) {
      return currentIndex; // continue on same card until its two hints are used
    }

    for (let offset = 0; offset < 6; offset++) {
      const idx = ((currentIndex < 0 ? -1 : currentIndex) + 1 + offset) % 6;
      if (isEligible(idx)) return idx;
    }
    return -1;
  };

  const handleRequestHint = () => {
    if (!quizData) return;

    const targetIndex = getTargetIndexForNextPress(lastHintTargetIndex);
    if (targetIndex === -1) {
      // No eligible cards left for hints
      return;
    }

    const currentCount = hintsUsedByRank[targetIndex] || 0;
    const playerHints = quizData.quiz.hints.filter(h => h.rank === targetIndex + 1);
    const hintToShow = playerHints[currentCount];

    if (hintToShow) {
      setCurrentHint(hintToShow.text);
      setCurrentHintRank(targetIndex + 1);
      setLastHintTargetIndex(targetIndex);
      // Increment per-player hint count (cap at 2)
      setHintsUsedByRank(prev => {
        const next = [...prev];
        next[targetIndex] = Math.min(2, (next[targetIndex] || 0) + 1);
        return next;
      });

      // Clear hint after duration: first hint 10s, second hint 5s
      const displayDuration = currentCount === 0 ? 10000 : 5000;
      if (hintTimeoutRef.current) {
        clearTimeout(hintTimeoutRef.current);
        hintTimeoutRef.current = null;
      }
      hintTimeoutRef.current = window.setTimeout(() => {
        setCurrentHint(undefined);
        setCurrentHintRank(undefined);
        hintTimeoutRef.current = null;
      }, displayDuration);
    }
  };

  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  // Compute current target and remaining hints for the next press (continue same card until exhausted)
  const nextPressTargetIndex = getTargetIndexForNextPress(lastHintTargetIndex);
  const nextEligibleHintsRemaining = nextPressTargetIndex === -1 ? 0 : (maxHintsPerPlayer - (hintsUsedByRank[nextPressTargetIndex] || 0));

  // Show loading spinner while checking completion or loading quiz
  if (isCheckingCompletion || !quizData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up md:grid" style={{ minHeight: 'calc(100 * var(--initial-vh, 1vh))', gridTemplateRows: '1fr auto' }}>
      {/* Mobile Layout: Fixed shell that doesn't move with keyboard */}
      <div className="md:hidden fixed inset-0 flex flex-col" style={{ height: `${initialHeight}px` }}>
        <div className="shrink-0">
          <Header hideOnMobile={false} />
        </div>
        
        {/* Scrollable Content Area - Mobile */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto webkit-overflow-scrolling-touch overscroll-none pb-[200px]">
          <div className="container max-w-2xl mx-auto px-2 py-0 flex flex-col gap-0.5">

            {/* Question Header */}
            <div className="shrink-0">
              <QuizHeader
                title={quizData.quiz.title}
                description=""
                date={quizData.date}
                timeRemaining={overallTimeRemaining}
                totalTime={totalQuizTime}
                playerTimeRemaining={0}
                playerTotalTime={0}
                score={score}
                streak={streak}
                hintsUsed={hintsUsed}
                maxHints={maxHintsPerPlayer}
                onSubmit={() => {}}
                isDisabled={isCompleted}
                correctCount={correctCount}
                totalCount={6}
                isCompleted={isCompleted}
              />
            </div>

            {/* Answer Grid */}
            <div className="flex flex-col gap-0 mt-3 mb-3">
              <AnswerGrid 
                answers={userAnswers} 
                lastGuessRank={lastGuessRank}
                disabled={isCompleted}
                hintsUsed={hintsUsed}
                currentHint={currentHint}
                currentHintRank={currentHintRank}
                lastAnswerPoints={lastAnswerPoints}
                lastAnswerTime={lastAnswerTime}
              />
            </div>

            {/* Input bar with more spacing - Mobile */}
            <div className="mt-4">
              <GuessInput
                onGuess={handleGuess}
                onRequestHint={handleRequestHint}
                disabled={isCompleted}
                hintsRemaining={nextEligibleHintsRemaining}
                currentHint={currentHint}
                showError={showInputError}
                showSuccess={showInputSuccess}
                hintsUsed={hintsUsed}
                onFocusChange={setIsInputFocused}
              />
            </div>
          </div>
        </div>

        {/* Removed fixed input overlay - now in content flow */}
      </div>

      {/* Desktop Layout: Centered with better spacing */}
      <div className="hidden md:flex md:flex-col md:items-center md:justify-center" style={{ minHeight: 'calc(100 * var(--vh))' }}>
        <Header hideOnMobile={isInputFocused && !isCompleted} />
        
        {/* Centered Content Container - Desktop */}
        <main className="container max-w-3xl mx-auto px-6 py-8 flex-1 flex flex-col gap-6 w-full">
          {/* Question Header */}
          <div className="shrink-0">
            <QuizHeader
              title={quizData.quiz.title}
              description=""
              date={quizData.date}
              timeRemaining={overallTimeRemaining}
              totalTime={totalQuizTime}
              playerTimeRemaining={0}
              playerTotalTime={0}
              score={score}
              streak={streak}
              hintsUsed={hintsUsed}
              maxHints={maxHintsPerPlayer}
              onSubmit={() => {}}
              isDisabled={isCompleted}
              correctCount={correctCount}
              totalCount={6}
              isCompleted={isCompleted}
            />
          </div>

          {/* Answer Grid */}
          <div className="flex-1 flex flex-col gap-3">
            <AnswerGrid 
              answers={userAnswers} 
              lastGuessRank={lastGuessRank}
              disabled={isCompleted}
              hintsUsed={hintsUsed}
              currentHint={currentHint}
              currentHintRank={currentHintRank}
              lastAnswerPoints={lastAnswerPoints}
              lastAnswerTime={lastAnswerTime}
            />
          </div>

          {/* Input Section - Desktop: with generous spacing */}
          <div className="shrink-0 pb-8">
            <GuessInput
              onGuess={handleGuess}
              onRequestHint={handleRequestHint}
              disabled={isCompleted}
              hintsRemaining={nextEligibleHintsRemaining}
              currentHint={currentHint}
              showError={showInputError}
              showSuccess={showInputSuccess}
              hintsUsed={hintsUsed}
              onFocusChange={setIsInputFocused}
            />
          </div>
        </main>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Index;
