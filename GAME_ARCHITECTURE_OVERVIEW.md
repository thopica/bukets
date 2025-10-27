# Bukets NBA Trivia Game - Complete Architecture Overview

## Game Concept
**Bukets** is a daily NBA trivia quiz game where users identify the top 6 players for specific NBA statistics. It's designed as a daily challenge with leaderboards and streak tracking.

## Core Game Mechanics

### Quiz Structure
- **30 different quizzes** that rotate daily based on a start date (2025-10-02)
- Each quiz asks users to identify the **top 6 players** for a specific NBA statistic
- **90 seconds total time** (1:30 minutes)
- **No per-player timer** - users have full control over their 90 seconds
- **2 hints per player** (12 total per quiz, each hint costs -1 point)

### Scoring System
- **Base points**: 3 points per correct answer
- **Speed bonuses** (inclusive boundaries):
  - 0-10 seconds: +2 bonus (5 total points) - Golden
  - 10.01-15 seconds: +1 bonus (4 total points) - Orange  
  - 15+ seconds: +0 bonus (3 total points) - Green
- **Hint penalty**: -1 point per hint used (minimum 1 point per correct answer)
- **Maximum possible score**: 30 points (6 correct × 5 points each)
- **Minimum possible score**: 6 points (6 correct × 1 point each with max hints per player)

#### Scoring Implementation Details
- **Frontend calculation**: Handles time-based scoring and hint penalties correctly
  - Time bonus calculated in `Game.tsx` `calculateTimeBonus()` function
  - Hint penalty applied per-player based on `hintsUsedByRank` array
  - Final score: `3 + timeBonus - hintPenalty` per correct answer
- **Backend verification**: Trusts frontend score from `quiz_sessions.score`
  - Server validates correct answers against quiz data
  - Uses pre-calculated score from gameplay session
  - Prevents negative scores and ensures consistency
- **Score storage**: Final score stored in `daily_scores.total_score`
- **Visual feedback**: Color-coded animations (gold/orange/green) based on points earned

### User Authentication Requirements
- **CRITICAL**: Game scores are ONLY saved for logged-in users
- Guest users can play but their scores are not persisted
- Authentication is handled via Supabase Auth
- User profiles include country codes for leaderboard filtering

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **Tailwind CSS** + **shadcn/ui** for styling and components
- **React Router** for navigation
- **TanStack Query** for data fetching and caching
- **Mobile-first responsive design** with virtual keyboard support

### Backend Infrastructure
- **Supabase** (PostgreSQL + Auth)
- **Vercel** for hosting and serverless API functions
- **Real-time session management** for quiz progress persistence

### Key Components

#### Game.tsx (Main Quiz Interface)
- **Single overall timer** (90 seconds) - no per-player timers
- Session restoration on page refresh with progress persistence
- Auto-save progress every 4 seconds for logged-in users
- Handles both logged-in and guest users seamlessly
- Advanced mobile viewport management for keyboard handling
- Per-player hint tracking with `hintsUsedByRank` array
- Real-time score calculation with time bonuses

#### AnswerGrid.tsx
- Visual answer slots with smooth animations
- Confetti and score fly-up animations based on points earned
- Haptic feedback integration for correct/incorrect answers
- Color-coded feedback (gold/orange/green based on final points)
- Hint display integration with shimmer effects

#### GuessInput.tsx
- Input handling with virtual keyboard on mobile
- Hint request functionality with remaining count display
- Error/success state animations with shake effects
- Give up button with confirmation dialog

#### CarouselSingle.tsx (Training Mode)
- **Separate training mode** with 100+ quick Q&A questions
- Flip card interface for question/answer display
- Random question selection with tracking
- No scoring or time pressure - pure learning mode

#### Leaderboard.tsx
- Sortable rankings by score, accuracy, streak
- Country filtering support
- Multiple time periods (today, 7d, 30d, all-time)
- Medal icons for top 3 players

## Database Schema

### Core Tables

#### users
```sql
- id (UUID, Primary Key)
- google_id (TEXT, UNIQUE, NOT NULL) -- Google OAuth ID
- email (TEXT, UNIQUE, NOT NULL)
- display_name (TEXT, NULLABLE)
- avatar_url (TEXT, NULLABLE)
- country_code (TEXT, NULLABLE)
- privacy_opt_out (BOOLEAN, DEFAULT false)
- sound_enabled (BOOLEAN, DEFAULT true)
- created_at (TIMESTAMPTZ, DEFAULT now())
- last_active_at (TIMESTAMPTZ, DEFAULT now())
```

#### profiles
```sql
- id (UUID, Primary Key)
- user_id (UUID, UNIQUE, NOT NULL, FK to auth.users)
- display_name (TEXT, NULLABLE)
- email (TEXT, NULLABLE)
- avatar_url (TEXT, NULLABLE)
- country_code (TEXT, DEFAULT 'US')
- created_at (TIMESTAMPTZ, NOT NULL, DEFAULT now())
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT now())
```

#### daily_scores
```sql
- id (UUID, Primary Key)
- user_id (UUID, NOT NULL, FK to auth.users)
- quiz_date (DATE, NOT NULL)
- quiz_index (INTEGER, NOT NULL)
- total_score (INTEGER, NOT NULL)
- correct_guesses (INTEGER, NOT NULL)
- hints_used (INTEGER, NOT NULL)
- time_used (INTEGER, NOT NULL)
- started_at (TIMESTAMPTZ, NULLABLE) -- Quiz start time
- completed_at (TIMESTAMPTZ, DEFAULT now())
- UNIQUE(user_id, quiz_date) -- One score per user per day
```

#### user_streaks
```sql
- id (UUID, Primary Key)
- user_id (UUID, UNIQUE, NOT NULL, FK to auth.users)
- current_streak (INTEGER, DEFAULT 0)
- longest_streak (INTEGER, DEFAULT 0)
- last_play_date (DATE, NULLABLE)
- streak_start_date (DATE, NULLABLE)
- updated_at (TIMESTAMPTZ, DEFAULT now())
```

#### quiz_sessions
```sql
- id (UUID, Primary Key)
- user_id (UUID, NOT NULL, FK to auth.users)
- quiz_date (DATE, NOT NULL)
- started_at (TIMESTAMPTZ, NOT NULL, DEFAULT now())
- current_question_index (INTEGER, NOT NULL, DEFAULT 0)
- correct_answers (JSONB, NOT NULL, DEFAULT '[]')
- locked_questions (JSONB, NOT NULL, DEFAULT '[]')
- correct_ranks (INTEGER[], NOT NULL, DEFAULT '{}')
- status (TEXT, NOT NULL, DEFAULT 'in_progress')
- score (INTEGER, NOT NULL, DEFAULT 0)
- hints_used (INTEGER, NOT NULL, DEFAULT 0)
- completed_at (TIMESTAMPTZ, NULLABLE)
- updated_at (TIMESTAMPTZ, NOT NULL, DEFAULT now())
- turn_started_at (TIMESTAMPTZ, NOT NULL, DEFAULT now())
- revealed_ranks (INTEGER[], NULLABLE, DEFAULT '{}')
- UNIQUE(user_id, quiz_date) -- One session per user per day
```

#### user_roles
```sql
- id (UUID, Primary Key)
- user_id (UUID, NOT NULL, FK to auth.users)
- role (app_role, NOT NULL) -- 'admin' or 'user'
- created_at (TIMESTAMPTZ, DEFAULT now())
```

#### user_feedback
```sql
- id (UUID, Primary Key)
- user_id (UUID, NOT NULL, FK to auth.users)
- feedback_text (TEXT, NOT NULL)
- created_at (TIMESTAMPTZ, DEFAULT now())
```

### Database Functions
- `calculate_user_streak()` - Calculates streak values for a user
- `handle_new_user()` - Creates profile when new user signs up
- `update_streak_on_score_insert()` - Updates streaks when scores are completed
- `update_updated_at_column()` - Generic timestamp updater
- `refresh_leaderboard()` - Refreshes materialized view

### Database Optimization
- **Comprehensive indexing** for performance (24 indexes total)
- **Row Level Security (RLS)** enabled on all tables
- **Automated triggers** for streak calculation and timestamp updates
- **Data integrity** with foreign key constraints and unique constraints

## API Endpoints

### verify-guess.ts
- **Advanced fuzzy matching** for player names using multiple algorithms
- Uses Soundex, Levenshtein distance, phonetic matching, and token-based matching
- Handles aliases, nicknames, and common misspellings
- Supports reveal requests for timer expiration scenarios
- Returns correct answer data when match is found

### start-quiz-session.ts
- Creates or restores quiz sessions for logged-in users
- Prevents multiple attempts per day with completion checking
- Handles session expiration and partial progress restoration
- Returns remaining time and saved progress for session continuation
- Manages session state transitions (in_progress → completed)

### save-quiz-progress.ts
- Auto-saves progress during gameplay every 4 seconds
- Updates session with current score, answered ranks, and revealed ranks
- Resets turn timer when needed for accurate timing
- Only saves for logged-in users (guest progress not persisted)

### submit-score.ts
- Final score submission when quiz is completed
- Server-side verification of correct answers against quiz data
- Updates daily_scores table with verified results
- Handles streak calculations with automated triggers
- Marks session as completed to prevent replays
- Returns rank, streak data, and verified score

### get-leaderboard.ts
- Aggregates scores across multiple time periods (today, 7d, 30d, all-time)
- Supports country filtering for regional leaderboards
- Calculates accuracy percentages and average scores
- Returns ranked results with user profiles and streak data
- Handles empty leaderboard scenarios gracefully

### get-quiz-metadata.ts
- Returns quiz title and hints (no answers) for security
- Handles daily quiz rotation logic based on start date
- Implements caching to avoid repeated API calls
- Supports fetching specific quiz by index

## Game Flow

### For Logged-in Users
1. **Authentication check** - Verify user is logged in via Supabase Auth
2. **Session initialization** - Check if already completed today via `start-quiz-session`
3. **Quiz start** - Create new session or restore existing progress
4. **Progress tracking** - Auto-save every 4 seconds via `save-quiz-progress`
5. **Answer verification** - Server-side fuzzy matching via `verify-guess`
6. **Score calculation** - Frontend calculates speed bonuses and hint penalties
7. **Final submission** - Save to daily_scores via `submit-score` with verification
8. **Streak update** - Automated via database triggers
9. **Leaderboard update** - Score appears in rankings immediately

### For Guest Users
1. **No authentication** - Can play without account creation
2. **No session persistence** - Progress lost on page refresh
3. **No score saving** - Results not stored in database
4. **No leaderboard** - Cannot appear in rankings
5. **Limited functionality** - Cannot build streaks or track progress

### Training Mode (Carousel)
1. **Separate interface** - Accessed via `/carousel/single` route
2. **No scoring** - Pure learning mode with 100+ questions
3. **Flip card interface** - Question/answer display with animations
4. **Random selection** - Tracks shown questions to avoid repetition
5. **No time pressure** - Users can take their time to learn

## Key Features

### Session Persistence
- Quiz progress survives page refreshes for logged-in users
- Server-side timer management with accurate restoration
- Automatic session restoration with progress recovery
- Prevents timer manipulation through server validation

### Advanced Name Matching
- Multiple algorithms for fuzzy matching (Soundex, Levenshtein, phonetic)
- Handles common misspellings and variations
- Supports player nicknames and aliases from quiz data
- Token-based matching for first/last name combinations
- Phonetic matching for similar-sounding names

### Mobile Optimization
- Virtual keyboard for mobile devices with custom viewport handling
- Touch-friendly interface with haptic feedback
- Responsive design for all screen sizes
- Custom CSS for keyboard viewport management
- Visual viewport API integration for smooth keyboard interactions

### Real-time Features
- Auto-save progress during gameplay (every 4 seconds)
- Live timer updates with visual progress indicators
- Immediate feedback on answers with animations
- Haptic feedback on mobile devices
- Confetti and score animations for correct answers

### Leaderboard System
- Multiple time periods (today, 7d, 30d, all-time)
- Country-based filtering for regional competition
- Sortable by score, accuracy, or streak
- Real-time updates with immediate score posting
- Medal icons and ranking display

### Training Mode
- Separate carousel interface with 100+ questions
- Flip card design for question/answer display
- Random question selection with tracking
- No scoring or time pressure - pure learning
- Categorized questions for focused study

## Development Notes

### Testing Considerations
- **Must be logged in** to test score saving functionality
- Can clear daily_scores record to replay same day
- Guest mode available for UI testing
- Multiple user accounts recommended for leaderboard testing
- Training mode accessible without authentication

### Deployment
- **Vercel** for frontend and API functions
- **Supabase** for database and authentication
- Environment variables for API keys
- CORS configured for cross-origin requests
- Serverless functions for API endpoints

### Data Storage
- **Quiz data**: Stored in `quizzes.json` file with 30 quizzes
- **Training data**: Stored in `src/data/carousel_questions.json` with 100+ questions
- **Player validation**: Server-side fuzzy matching with aliases
- **Session data**: Real-time persistence in `quiz_sessions` table

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **User-specific data access** with proper authentication
- **Server-side score verification** to prevent cheating
- **Session-based progress tracking** with expiration handling

## Current Status
- Game is fully functional for both logged-in and guest users
- Score saving works correctly with server-side verification
- Mobile experience is optimized with virtual keyboard
- Leaderboards are populated with real user data
- Daily quiz rotation is working with 30 quizzes
- Training mode is fully implemented
- All core features are implemented and tested

## Known Limitations
- Guest users cannot save scores (by design)
- One quiz attempt per day per user
- Requires internet connection for all functionality
- Mobile keyboard affects viewport (handled with custom CSS)
- Training mode has no progress tracking
