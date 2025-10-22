# Streak Function Fix - Deployment Guide

## Summary
Fixed the streak function by correcting the foreign key constraint and adding error handling. The issue was that `user_streaks.user_id` was pointing to `public.users.id` instead of `auth.users.id`.

## Files Created/Modified

### 1. Migration File
- **File:** `supabase/migrations/20250105000000_fix_user_streaks_foreign_key.sql`
- **Purpose:** Fixes the foreign key constraint to point to `auth.users.id`

### 2. Edge Function
- **File:** `supabase/functions/submit-score/index.ts`
- **Changes:** Added error handling for streak UPDATE and INSERT operations

### 3. Backfill Script
- **File:** `backfill_streaks.sql`
- **Purpose:** Calculates and populates historical streak data from existing `daily_scores`

### 4. Test Script
- **File:** `test_streak_fix.sql`
- **Purpose:** Verifies the fix works correctly

## Deployment Steps

### Step 1: Apply the Migration
```bash
# Deploy the migration to fix the foreign key
supabase db push
```

### Step 2: Run the Backfill Script
```bash
# Connect to your production database and run:
psql -h your-db-host -U postgres -d postgres -f backfill_streaks.sql
```

### Step 3: Deploy the Edge Function
```bash
# Deploy the updated edge function
supabase functions deploy submit-score
```

### Step 4: Test the Fix
```bash
# Run the test script to verify everything works
psql -h your-db-host -U postgres -d postgres -f test_streak_fix.sql
```

## Verification

After deployment, verify that:

1. **Foreign Key is Fixed:**
   ```sql
   SELECT constraint_name, column_name, foreign_table_name
   FROM information_schema.table_constraints tc
   JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
   WHERE tc.table_name = 'user_streaks' AND tc.constraint_type = 'FOREIGN KEY';
   ```
   Should show: `foreign_table_name = 'users'` and `foreign_table_schema = 'auth'`

2. **Streak Data is Populated:**
   ```sql
   SELECT COUNT(*) FROM user_streaks;
   ```
   Should return > 0 (was 0 before)

3. **New Quiz Submissions Work:**
   - Complete a quiz in production
   - Check that streak is updated in `user_streaks` table
   - Verify no errors in edge function logs

## Expected Results

- ✅ Users who have played multiple consecutive days will have correct streak counts
- ✅ New quiz submissions will properly update streaks
- ✅ Error handling will log any future issues instead of failing silently
- ✅ Account page will show correct streak data

## Rollback Plan

If issues occur:

1. **Revert Edge Function:**
   ```bash
   git checkout HEAD~1 -- supabase/functions/submit-score/index.ts
   supabase functions deploy submit-score
   ```

2. **Revert Migration (if needed):**
   ```sql
   -- Drop the correct FK and restore the incorrect one
   ALTER TABLE public.user_streaks DROP CONSTRAINT user_streaks_user_id_fkey;
   ALTER TABLE public.user_streaks ADD CONSTRAINT user_streaks_user_id_fkey 
   FOREIGN KEY (user_id) REFERENCES public.users(id);
   ```

## Notes

- The backfill script calculates streaks based on consecutive play dates
- Users with gaps in their play history will have their current streak reset appropriately
- The `streak_start_date` column exists but is not populated (can be added later if needed)
