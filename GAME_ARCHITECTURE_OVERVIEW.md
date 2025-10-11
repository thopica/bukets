# Bukets NBA Trivia Game - Complete Architecture Overview

## Game Concept
**Bukets** is a daily NBA trivia quiz game where users identify the top 6 players for specific NBA statistics. It's designed as a daily challenge with leaderboards and streak tracking.

## Core Game Mechanics

### Quiz Structure
- **30 different quizzes** that rotate daily based on a start date (2025-10-02)
- Each quiz asks users to identify the **top 6 players** for a specific NBA statistic
- **2 minutes 40 seconds total time** (160 seconds)
- **24 seconds per player** with auto-reveal if time runs out
- **2 hints maximum** per quiz (each hint costs -1 point)

### Scoring System
- **Base points**: 3 points per correct answer
- **Speed bonuses**:
  - 0-10 seconds: +2 bonus (5 total points) - Golden
  - 10-15 seconds: +1 bonus (4 total points) - Orange  
  - 15+ seconds: +0 bonus (3 total points) - Green
- **Hint penalty**: -1 point per hint used
- **Maximum possible score**: 30 points (6 correct × 5 points each)

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
- **Supabase** (PostgreSQL + Auth + Edge Functions)
- **Vercel** for hosting and serverless API functions
- **Real-time session management** for quiz progress persistence

### Key Components

#### Game.tsx (Main Quiz Interface)
- Complex timer management (overall + per-player timers)
- Session restoration on page refresh
- Auto-save progress every 4 seconds
- Handles both logged-in and guest users
- Mobile viewport management for keyboard handling

#### AnswerGrid.tsx
- Visual answer slots with animations
- Confetti and score fly-up animations
- Haptic feedback integration
- Color-coded feedback (green/orange/gold based on speed)

#### GuessInput.tsx
- Input handling with virtual keyboard on mobile
- Hint request functionality
- Error/success state animations

#### Leaderboard.tsx
- Sortable rankings by score, accuracy, streak
- Country filtering
- Multiple time periods (today, 7d, 30d, all-time)
- Medal icons for top 3

## Database Schema

### Core Tables

#### profiles
```sql
- user_id (UUID, Primary Key)
- display_name (TEXT)
- country_code (TEXT)
- email (TEXT)
- avatar_url (TEXT)
- is_bot (BOOLEAN)
- bot_skill_level (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### daily_scores
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- quiz_date (DATE)
- quiz_index (INTEGER)
- total_score (INTEGER)
- correct_guesses (INTEGER)
- hints_used (INTEGER)
- time_used (INTEGER)
- started_at (TIMESTAMP WITH TIME ZONE) -- Recently added
- completed_at (TIMESTAMP WITH TIME ZONE)
- answered_ranks (INTEGER[]) -- Array of correctly answered ranks
- UNIQUE(user_id, quiz_date) -- One score per user per day
```

#### user_streaks
```sql
- user_id (UUID, Primary Key)
- current_streak (INTEGER)
- longest_streak (INTEGER)
- last_play_date (DATE)
- updated_at (TIMESTAMP WITH TIME ZONE)
```

#### quiz_sessions
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- quiz_date (DATE)
- score (INTEGER)
- hints_used (INTEGER)
- correct_ranks (INTEGER[])
- revealed_ranks (INTEGER[])
- started_at (TIMESTAMP)
- turn_started_at (TIMESTAMP)
- completed_at (TIMESTAMP)
- status (TEXT) -- 'in_progress' or 'completed'
- current_question_index (INTEGER)
- correct_answers (JSON)
- locked_questions (JSON)
- updated_at (TIMESTAMP)
```

#### bot_pool & bot_daily_scores
- Used for generating fake players on leaderboards
- Bots have different skill levels and generate realistic scores

## API Endpoints

### verify-guess.ts
- **Advanced fuzzy matching** for player names
- Uses Soundex, Levenshtein distance, and phonetic matching
- Handles aliases, nicknames, and common misspellings
- Returns correct answer data when match is found

### start-quiz-session.ts
- Creates or restores quiz sessions
- Prevents multiple attempts per day
- Handles session expiration and partial progress
- Returns remaining time and saved progress

### save-quiz-progress.ts
- Auto-saves progress during gameplay
- Updates session with current score and answered ranks
- Resets turn timer when needed

### submit-score.ts
- Final score submission when quiz is completed
- Updates daily_scores table with verified results
- Handles streak calculations
- Marks session as completed

### get-leaderboard.ts
- Aggregates scores across time periods
- Supports country filtering
- Calculates accuracy percentages
- Returns ranked results with user profiles

### get-quiz-metadata.ts
- Returns quiz title and hints (no answers)
- Handles daily quiz rotation logic
- Caches results to avoid repeated API calls

## Game Flow

### For Logged-in Users
1. **Authentication check** - Verify user is logged in
2. **Session initialization** - Check if already completed today
3. **Quiz start** - Create or restore quiz session
4. **Progress tracking** - Auto-save every 4 seconds
5. **Answer verification** - Server-side fuzzy matching
6. **Score calculation** - Speed bonuses and hint penalties
7. **Final submission** - Save to daily_scores table
8. **Streak update** - Update user_streaks table
9. **Leaderboard update** - Score appears in rankings

### For Guest Users
1. **No authentication** - Can play without account
2. **No session persistence** - Progress lost on refresh
3. **No score saving** - Results not stored in database
4. **No leaderboard** - Cannot appear in rankings
5. **Limited functionality** - Cannot build streaks

## Key Features

### Session Persistence
- Quiz progress survives page refreshes
- Server-side timer management
- Automatic session restoration
- Prevents timer manipulation

### Advanced Name Matching
- Multiple algorithms for fuzzy matching
- Handles common misspellings and variations
- Supports player nicknames and aliases
- Phonetic matching for similar-sounding names

### Mobile Optimization
- Virtual keyboard for mobile devices
- Custom viewport handling
- Touch-friendly interface
- Responsive design for all screen sizes

### Real-time Features
- Auto-save progress during gameplay
- Live timer updates
- Immediate feedback on answers
- Haptic feedback on mobile

### Leaderboard System
- Multiple time periods (today, 7d, 30d, all-time)
- Country-based filtering
- Sortable by score, accuracy, or streak
- Bot players for populated leaderboards

## Development Notes

### Testing Considerations
- **Must be logged in** to test score saving functionality
- Can clear daily_scores record to replay same day
- Guest mode available for UI testing
- Multiple user accounts recommended for leaderboard testing

### Deployment
- **Vercel** for frontend and API functions
- **Supabase** for database and authentication
- Environment variables for API keys
- CORS configured for cross-origin requests

### Recent Fixes
- **started_at column** added to daily_scores table (migration applied)
- Session management improved for timer persistence
- Mobile keyboard handling optimized
- Auto-save functionality enhanced

## Current Status
- Game is fully functional for logged-in users
- Score saving works correctly after database migration
- Mobile experience is optimized
- Leaderboards are populated with real and bot data
- Daily quiz rotation is working
- All core features are implemented and tested

## Known Limitations
- Guest users cannot save scores (by design)
- One quiz attempt per day per user
- Requires internet connection for all functionality
- Mobile keyboard can affect viewport (handled with custom CSS)
