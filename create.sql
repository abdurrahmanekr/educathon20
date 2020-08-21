
-- tables
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
