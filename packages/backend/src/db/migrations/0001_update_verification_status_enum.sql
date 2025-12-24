-- Migration: Update verification_status enum to match Didit's 8 statuses
-- Old values: pending, processing, approved, denied, error
-- New values: not_started, in_progress, approved, declined, kyc_expired, in_review, expired, abandoned

-- Add new enum values
ALTER TYPE verification_status ADD VALUE IF NOT EXISTS 'not_started';
ALTER TYPE verification_status ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE verification_status ADD VALUE IF NOT EXISTS 'declined';
ALTER TYPE verification_status ADD VALUE IF NOT EXISTS 'kyc_expired';
ALTER TYPE verification_status ADD VALUE IF NOT EXISTS 'in_review';
ALTER TYPE verification_status ADD VALUE IF NOT EXISTS 'expired';
ALTER TYPE verification_status ADD VALUE IF NOT EXISTS 'abandoned';

-- Update existing data to use new status values
UPDATE user_verification_status SET status = 'not_started' WHERE status = 'pending';
UPDATE user_verification_status SET status = 'in_progress' WHERE status = 'processing';
UPDATE user_verification_status SET status = 'declined' WHERE status = 'denied';
UPDATE user_verification_status SET status = 'expired' WHERE status = 'error';

-- Update default value for the status column
ALTER TABLE user_verification_status ALTER COLUMN status SET DEFAULT 'not_started';
