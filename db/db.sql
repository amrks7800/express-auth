CREATE DATABASE Blog;

CREATE table
  users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL CHECK (LENGTH (password) > 8),
    email VARCHAR(255) NOT NULL
  );