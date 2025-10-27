# Bukets Database Documentation

## Executive Summary

The Bukets database is designed for a daily quiz application where users compete in geography-based guessing games. The database manages user authentication, quiz sessions, scoring, streaks, leaderboards, and feedback. It uses PostgreSQL with Supabase's Row Level Security (RLS) for data protection and includes automated streak calculation and user management.

### Key Features
- **User Management**: Google OAuth integration with profile management
- **Quiz System**: Daily quiz sessions with progress tracking
- **Scoring & Streaks**: Automated streak calculation and leaderboard generation
- **Security**: Comprehensive RLS policies for data protection
- **Performance**: Optimized indexes for leaderboard and streak queries

---

## Database Schema Overview

### Tables (7)
- `users` - Core user authentication data
- `profiles` - Extended user profile information
- `user_streaks` - Daily streak tracking
- `user_roles` - Role-based access control
- `quiz_sessions` - Active quiz progress
- `daily_scores` - Completed quiz results
- `user_feedback` - User feedback submissions

### Extensions
- `plpgsql` - Procedural language
- `pgcrypto` - Cryptographic functions
- `uuid-ossp` - UUID generation
- `pg_stat_statements` - Query statistics
- `pg_graphql` - GraphQL support
- `supabase_vault` - Vault functionality

---

## Tables Documentation

### 1. users
**Purpose**: Core user authentication and basic profile data

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique user identifier |
| google_id | text | UNIQUE, NOT NULL | Google OAuth ID |
| email | text | UNIQUE, NOT NULL | User email address |
| display_name | text | NULLABLE | User's display name |
| avatar_url | text | NULLABLE | Profile picture URL |
| country_code | text | NULLABLE | User's country |
| privacy_opt_out | boolean | DEFAULT false | Privacy settings |
| sound_enabled | boolean | DEFAULT true | Sound preferences |
| created_at | timestamptz | DEFAULT now() | Account creation time |
| last_active_at | timestamptz | DEFAULT now() | Last activity time |

**Relationships**:
- One-to-one with `profiles` (user_id)
- One-to-one with `user_streaks` (user_id)
- One-to-many with `quiz_sessions` (user_id)
- One-to-many with `daily_scores` (user_id)
- One-to-many with `user_feedback` (user_id)
- One-to-many with `user_roles` (user_id)

### 2. profiles
**Purpose**: Extended user profile information for leaderboards

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique profile identifier |
| user_id | uuid | UNIQUE, NOT NULL, FK to auth.users | User reference |
| display_name | text | NULLABLE | Display name for leaderboards |
| email | text | NULLABLE | Email for notifications |
| avatar_url | text | NULLABLE | Profile picture |
| country_code | text | DEFAULT 'US' | Country for regional leaderboards |
| created_at | timestamptz | NOT NULL, DEFAULT now() | Profile creation |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | Last update time |

**Relationships**:
- Many-to-one with `users` (user_id)

### 3. user_streaks
**Purpose**: Track consecutive daily quiz completion streaks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique streak record |
| user_id | uuid | UNIQUE, NOT NULL, FK to auth.users | User reference |
| current_streak | integer | DEFAULT 0 | Current consecutive days |
| longest_streak | integer | DEFAULT 0 | Best streak ever achieved |
| last_play_date | date | NULLABLE | Last quiz completion date |
| streak_start_date | date | NULLABLE | Start of current streak |
| updated_at | timestamptz | DEFAULT now() | Last streak update |

**Relationships**:
- Many-to-one with `users` (user_id)

### 4. user_roles
**Purpose**: Role-based access control system

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique role assignment |
| user_id | uuid | NOT NULL, FK to auth.users | User reference |
| role | app_role | NOT NULL | Role type (admin/user) |
| created_at | timestamptz | DEFAULT now() | Role assignment time |

**Relationships**:
- Many-to-one with `users` (user_id)

**Custom Type**: `app_role` enum
- `admin` - Administrative privileges
- `user` - Standard user privileges

### 5. quiz_sessions
**Purpose**: Track active quiz sessions and progress

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique session identifier |
| user_id | uuid | NOT NULL | User reference |
| quiz_date | date | NOT NULL | Date of the quiz |
| started_at | timestamptz | NOT NULL, DEFAULT now() | Session start time |
| current_question_index | integer | NOT NULL, DEFAULT 0 | Current question position |
| correct_answers | jsonb | NOT NULL, DEFAULT '[]' | Correct answer tracking |
| locked_questions | jsonb | NOT NULL, DEFAULT '[]' | Locked question tracking |
| correct_ranks | integer[] | NOT NULL, DEFAULT '{}' | Correct rank tracking |
| status | text | NOT NULL, DEFAULT 'in_progress' | Session status |
| score | integer | NOT NULL, DEFAULT 0 | Current session score |
| hints_used | integer | NOT NULL, DEFAULT 0 | Hints consumed |
| completed_at | timestamptz | NULLABLE | Completion time |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | Last update time |
| turn_started_at | timestamptz | NOT NULL, DEFAULT now() | Current turn start |
| revealed_ranks | integer[] | NULLABLE, DEFAULT '{}' | Revealed rank tracking |

**Relationships**:
- Many-to-one with `users` (user_id)

**Constraints**:
- UNIQUE(user_id, quiz_date) - One session per user per day

### 6. daily_scores
**Purpose**: Store completed quiz results and scores

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique score record |
| user_id | uuid | NOT NULL, FK to auth.users | User reference |
| quiz_date | date | NOT NULL | Date of completed quiz |
| quiz_index | integer | NOT NULL | Quiz version index |
| total_score | integer | NOT NULL | Final quiz score |
| correct_guesses | integer | NOT NULL | Number of correct answers |
| hints_used | integer | NOT NULL | Total hints consumed |
| time_used | integer | NOT NULL | Time taken (seconds) |
| started_at | timestamptz | NULLABLE | Quiz start time |
| completed_at | timestamptz | DEFAULT now() | Completion time |

**Relationships**:
- Many-to-one with `users` (user_id)

**Constraints**:
- UNIQUE(user_id, quiz_date) - One score per user per day

### 7. user_feedback
**Purpose**: Collect user feedback and suggestions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | Unique feedback record |
| user_id | uuid | NOT NULL, FK to auth.users | User reference |
| feedback_text | text | NOT NULL | Feedback content |
| created_at | timestamptz | DEFAULT now() | Submission time |

**Relationships**:
- Many-to-one with `users` (user_id)

---

## Functions Documentation

### 1. calculate_user_streak(p_user_id uuid, p_quiz_date date)
**Purpose**: Calculate streak values for a user on a given quiz date

**Returns**: TABLE(current_streak integer, longest_streak integer, streak_start_date date)

**Logic**:
1. Finds the previous quiz completion date for the user
2. Calculates gap between previous and current play dates
3. If gap = 1 day: Increments current streak
4. If gap > 1 day: Resets streak to 1
5. Updates longest streak if current exceeds previous best
6. Calculates streak start date by finding the earliest consecutive date

**Usage**: Called by triggers when daily_scores are inserted/updated

### 2. handle_new_user()
**Purpose**: Trigger function to create profile when new user signs up

**Returns**: trigger

**Logic**:
1. Extracts display name from user metadata (display_name, full_name, or email prefix)
2. Inserts new profile record with user_id, email, and display_name

**Usage**: Triggered on auth.users INSERT

### 3. update_streak_on_score_insert()
**Purpose**: Trigger function to update user streaks when scores are completed

**Returns**: trigger

**Logic**:
1. Only processes if score is completed (completed_at IS NOT NULL)
2. Calls calculate_user_streak() to get new streak values
3. Inserts or updates user_streaks record with calculated values

**Usage**: Triggered on daily_scores INSERT/UPDATE

### 4. update_updated_at_column()
**Purpose**: Generic trigger function to update timestamp columns

**Returns**: trigger

**Logic**:
1. Sets NEW.updated_at to current timestamp
2. Returns the modified record

**Usage**: Triggered on quiz_sessions UPDATE

### 5. refresh_leaderboard()
**Purpose**: Refresh materialized view for leaderboard data

**Returns**: void

**Logic**:
1. Refreshes leaderboard_daily materialized view concurrently

**Usage**: Called by scheduled jobs or manual refresh

---

## Security Documentation (RLS Policies)

### users table
- **Users can view own profile**: `auth.uid()::text = google_id`
- **Users can update own profile**: `auth.uid()::text = google_id`

### profiles table
- **Anyone can view profiles for leaderboard**: `true` (public read)
- **Users can view their own profile**: `auth.uid() = user_id`
- **Users can insert their own profile**: `auth.uid() = user_id`
- **Users can update their own profile**: `auth.uid() = user_id`

### user_streaks table
- **Anyone can view streaks**: `true` (public read for leaderboards)
- **Users can insert own streak**: `auth.uid() = user_id`
- **Users can update own streak**: `auth.uid() = user_id`

### user_roles table
- **Users can view their own roles**: `auth.uid() = user_id` (authenticated only)

### quiz_sessions table
- **Users can create their own quiz session**: `auth.uid() = user_id`
- **Users can view their own quiz sessions**: `auth.uid() = user_id`
- **Users can update their own quiz session**: `auth.uid() = user_id`

### daily_scores table
- **Anyone can view scores**: `true` (public read for leaderboards)
- **Users can insert own scores**: `auth.uid() = user_id`
- **Users can update own incomplete scores**: `auth.uid() = user_id AND completed_at IS NULL`

### user_feedback table
- **Users can view their own feedback**: `auth.uid() = user_id`
- **Users can insert their own feedback**: `auth.uid() = user_id`
- **Admins can view all feedback**: `EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin')`

---

## Triggers Documentation

### 1. trg_update_streak_on_score_insert
**Table**: daily_scores
**Events**: INSERT, UPDATE
**Timing**: AFTER
**Function**: update_streak_on_score_insert()
**Purpose**: Automatically calculate and update user streaks when scores are completed

### 2. trg_update_streak_on_score_update
**Table**: daily_scores
**Events**: UPDATE
**Timing**: AFTER
**Function**: update_streak_on_score_insert()
**Purpose**: Recalculate streaks when score data is modified

### 3. trg_quiz_sessions_updated_at
**Table**: quiz_sessions
**Events**: UPDATE
**Timing**: BEFORE
**Function**: update_updated_at_column()
**Purpose**: Automatically update the updated_at timestamp

---

## Indexes Documentation

### Primary Key Indexes
- `users_pkey` - Primary key on users.id
- `profiles_pkey` - Primary key on profiles.id
- `user_streaks_pkey` - Primary key on user_streaks.id
- `user_roles_pkey` - Primary key on user_roles.id
- `quiz_sessions_pkey` - Primary key on quiz_sessions.id
- `daily_scores_pkey` - Primary key on daily_scores.id
- `user_feedback_pkey` - Primary key on user_feedback.id

### Unique Constraint Indexes
- `users_email_key` - Unique email addresses
- `users_google_id_key` - Unique Google IDs
- `profiles_user_id_key` - One profile per user
- `user_streaks_user_id_key` - One streak record per user
- `user_roles_user_id_role_key` - One role per user per role type
- `quiz_sessions_unique_user_day` - One session per user per day
- `daily_scores_user_id_quiz_date_key` - One score per user per day

### Performance Indexes
- `idx_users_email` - Email lookups
- `idx_users_google_id` - Google ID lookups
- `idx_daily_scores_user` - User score queries
- `idx_daily_scores_date` - Date-based queries
- `idx_daily_scores_score` - Score-based sorting (DESC)
- `idx_daily_scores_user_date_started` - User progress queries
- `idx_streaks_user_id` - User streak lookups
- `idx_streaks_current` - Streak leaderboards (DESC)
- `idx_user_feedback_user_id` - User feedback queries
- `idx_user_feedback_created_at` - Feedback timeline queries

---

## Data Flow Diagrams

### User Registration Flow
```
Google OAuth → auth.users → handle_new_user() → profiles table
```

### Quiz Completion Flow
```
User completes quiz → daily_scores INSERT → update_streak_on_score_insert() → user_streaks UPDATE
```

### Leaderboard Generation Flow
```
daily_scores + profiles → refresh_leaderboard() → leaderboard_daily materialized view
```

### Session Management Flow
```
User starts quiz → quiz_sessions INSERT → Progress updates → quiz_sessions UPDATE → daily_scores INSERT (on completion)
```

---

## Recommendations

### Security
1. **Review RLS Policies**: Ensure all policies are properly tested and cover edge cases
2. **Admin Access**: Consider implementing admin-only functions for data management
3. **Audit Logging**: Add audit trails for sensitive operations

### Performance
1. **Query Optimization**: Monitor slow queries using pg_stat_statements
2. **Index Maintenance**: Regularly analyze index usage and remove unused indexes
3. **Partitioning**: Consider partitioning daily_scores by date for large datasets

### Maintenance
1. **Data Cleanup**: Implement automated cleanup of old quiz sessions
2. **Backup Strategy**: Ensure regular backups of user data and streaks
3. **Monitoring**: Set up alerts for failed streak calculations or data inconsistencies

### Scalability
1. **Caching**: Implement Redis caching for leaderboard data
2. **Read Replicas**: Consider read replicas for leaderboard queries
3. **Archiving**: Archive old daily_scores data to reduce table size

---

## Migration History
The database has 27 migration files in the supabase/migrations directory, indicating active development and schema evolution.

---

*Document generated on: $(date)*
*Database version: PostgreSQL with Supabase extensions*
