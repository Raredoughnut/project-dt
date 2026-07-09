CREATE TYPE "public"."scoring_type" AS ENUM('axis', 'sum');--> statement-breakpoint
CREATE TYPE "public"."test_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid NOT NULL,
	"result_code" text NOT NULL,
	"referrer" text,
	"channel" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "choices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"label" text NOT NULL,
	"scores" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"text" text NOT NULL,
	"group_key" text
);
--> statement-breakpoint
CREATE TABLE "result_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_id" uuid NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"image" text,
	"traits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"recommended_slugs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "result_cards_test_code_unq" UNIQUE("test_id","code")
);
--> statement-breakpoint
CREATE TABLE "test_set_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"test_set_id" uuid NOT NULL,
	"test_id" uuid NOT NULL,
	"order" integer NOT NULL,
	CONSTRAINT "test_set_items_unq" UNIQUE("test_set_id","test_id")
);
--> statement-breakpoint
CREATE TABLE "test_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "test_sets_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"cover_image" text,
	"scoring_type" "scoring_type" DEFAULT 'sum' NOT NULL,
	"status" "test_status" DEFAULT 'draft' NOT NULL,
	"author_name" text,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tests_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "choices" ADD CONSTRAINT "choices_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "result_cards" ADD CONSTRAINT "result_cards_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_set_items" ADD CONSTRAINT "test_set_items_test_set_id_test_sets_id_fk" FOREIGN KEY ("test_set_id") REFERENCES "public"."test_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "test_set_items" ADD CONSTRAINT "test_set_items_test_id_tests_id_fk" FOREIGN KEY ("test_id") REFERENCES "public"."tests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attempts_test_created_idx" ON "attempts" USING btree ("test_id","created_at");--> statement-breakpoint
CREATE INDEX "attempts_created_idx" ON "attempts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "choices_question_idx" ON "choices" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "questions_test_idx" ON "questions" USING btree ("test_id");--> statement-breakpoint
CREATE INDEX "result_cards_test_idx" ON "result_cards" USING btree ("test_id");--> statement-breakpoint
CREATE INDEX "test_set_items_set_idx" ON "test_set_items" USING btree ("test_set_id");--> statement-breakpoint
CREATE INDEX "tests_status_published_idx" ON "tests" USING btree ("status","published_at");