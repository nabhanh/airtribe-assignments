CREATE TABLE IF NOT EXISTS "booking_seat" (
	"booking_id" integer NOT NULL,
	"seat_row" integer NOT NULL,
	"seat_column" text NOT NULL,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	CONSTRAINT booking_seat_booking_id_seat_row_seat_column PRIMARY KEY("booking_id","seat_row","seat_column")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie" (
	"movie_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"language" text NOT NULL,
	"duration" integer NOT NULL,
	"release_date" text NOT NULL,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_screening" (
	"movie_screening_id" integer PRIMARY KEY NOT NULL,
	"movie_id" integer NOT NULL,
	"screen_id" integer NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"custom_repeat" text DEFAULT 'RRULE:FREQ=DAILY;',
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "movie_theatre" (
	"movie_id" integer NOT NULL,
	"theatre_id" integer NOT NULL,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "screen" (
	"screen_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"theatre_id" integer NOT NULL,
	"rows" integer NOT NULL,
	"seat_count" integer NOT NULL,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "screen_seat" (
	"screen_id" integer NOT NULL,
	"seat_row" integer NOT NULL,
	"seat_column" text NOT NULL,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL,
	CONSTRAINT screen_seat_screen_id_seat_row_seat_column PRIMARY KEY("screen_id","seat_row","seat_column")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "theatre" (
	"theatre_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"pincode" integer NOT NULL,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (6) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_booking" (
	"booking_id" integer PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"movie_screening_id" integer,
	"seat_count" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp (6) with time zone NOT NULL,
	"updated_at" timestamp (6) with time zone NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "movie_theatre_pk" ON "movie_theatre" ("movie_id","theatre_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "city_idx" ON "theatre" ("city");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "user" ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "booking_seat" ADD CONSTRAINT "booking_seat_booking_id_user_booking_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "user_booking"("booking_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movie_screening" ADD CONSTRAINT "movie_screening_movie_id_movie_movie_id_fk" FOREIGN KEY ("movie_id") REFERENCES "movie"("movie_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "movie_screening" ADD CONSTRAINT "movie_screening_screen_id_screen_screen_id_fk" FOREIGN KEY ("screen_id") REFERENCES "screen"("screen_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "screen" ADD CONSTRAINT "screen_theatre_id_theatre_theatre_id_fk" FOREIGN KEY ("theatre_id") REFERENCES "theatre"("theatre_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "screen_seat" ADD CONSTRAINT "screen_seat_screen_id_screen_screen_id_fk" FOREIGN KEY ("screen_id") REFERENCES "screen"("screen_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_booking" ADD CONSTRAINT "user_booking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_booking" ADD CONSTRAINT "user_booking_movie_screening_id_movie_screening_movie_screening_id_fk" FOREIGN KEY ("movie_screening_id") REFERENCES "movie_screening"("movie_screening_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
