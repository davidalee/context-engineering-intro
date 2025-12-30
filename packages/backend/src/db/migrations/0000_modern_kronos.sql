CREATE TYPE "public"."app_role" AS ENUM('admin', 'moderator', 'member');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'pending_review', 'published', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('not_started', 'in_progress', 'approved', 'declined', 'kyc_expired', 'in_review', 'expired', 'abandoned');--> statement-breakpoint
CREATE TABLE "health_checks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "health_checks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "name_alerts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "name_alerts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"search_name" text NOT NULL,
	"normalized_name" text NOT NULL,
	"location" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_matched_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"subject_name" text,
	"original_text" text NOT NULL,
	"rewritten_text" text,
	"location" text,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"moderation_flags" jsonb,
	"trigger_matches" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"bio" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "push_tokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "push_tokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"platform" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "push_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"role" "app_role" DEFAULT 'member' NOT NULL,
	"assigned_by" uuid,
	"assigned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_verification_status" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"status" "verification_status" DEFAULT 'not_started' NOT NULL,
	"provider" text,
	"verified_at" timestamp,
	"id_type" text,
	"id_country" text,
	"reject_reason" text,
	"transaction_reference" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_verification_status_transaction_reference_unique" UNIQUE("transaction_reference")
);
--> statement-breakpoint
CREATE INDEX "idx_alerts_user" ON "name_alerts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_alerts_normalized_name" ON "name_alerts" USING btree ("normalized_name");--> statement-breakpoint
CREATE INDEX "idx_posts_subject_name" ON "posts" USING btree ("subject_name");--> statement-breakpoint
CREATE INDEX "idx_posts_location" ON "posts" USING btree ("location");--> statement-breakpoint
CREATE INDEX "idx_push_tokens_user" ON "push_tokens" USING btree ("user_id");