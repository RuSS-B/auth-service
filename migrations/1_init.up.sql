CREATE TABLE "user" ("id" serial,"email" varchar(180) NOT NULL,"password" varchar NOT NULL, PRIMARY KEY ("id"));
ALTER TABLE "user" ADD COLUMN "full_name" varchar NOT NULL;
ALTER TABLE "user" ADD COLUMN "created_at" timestamptz NOT NULL DEFAULT NOW();
CREATE UNIQUE INDEX "email_unq" ON "public"."user" USING BTREE ("email");