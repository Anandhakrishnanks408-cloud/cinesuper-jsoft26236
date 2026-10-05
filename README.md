# CineSuper

A mini OTT movie database. Browse movies, search by title, filter by language, open a movie's details and leave a rating and review. The data lives in a Supabase (PostgreSQL) database and the front end is plain HTML, CSS and JavaScript.

Features
Browse all movies loaded live from Supabase
Search movies by title
Filter by language
Movie detail view with description, genre, duration and year
Average rating and review count for each movie
Add a review (name, rating 1 to 5, optional comment) that updates the ratings straight away
Tech stack
HTML, CSS and vanilla JavaScript (no framework)
Supabase (PostgreSQL) with the supabase-js client
Row Level Security (RLS) to control what the public can read and write
Git and GitHub, with one commit per build phase
Database design

Three tables and one view.

Table	Purpose	Key columns
genres	List of genres	id, name (unique)
movies	The movie catalogue	id, title, release_year, language, duration_min, description, poster_url, genre_id
reviews	User reviews	id, movie_id, reviewer_name, rating, comment, created_at

Relationships

movies.genre_id references genres.id. If a genre is deleted, the movie's genre is set to null.
reviews.movie_id references movies.id. If a movie is deleted, its reviews are deleted too.

Constraints

release_year must be between 1900 and 2100
duration_min must be greater than 0
rating must be between 1 and 5

View: movie_ratings

Joins movies with reviews and returns each movie's avg_rating (rounded to 1 decimal) and review_count. It uses a left join, so movies with no reviews still appear, with 0 reviews. It is created with security_invoker = on, so the caller's RLS policies apply.

Row Level Security

RLS is enabled on the tables. The public (anon) role can read movies, genres and reviews, and can add reviews through the "Public can add reviews" policy. See database/03_security.sql and screenshots/rls-policies.png.

Project structure
cinesuper-jsoft26236/
├── database/
│   ├── 01_tables.sql     create tables
│   ├── 02_seed.sql       sample data
│   ├── 03_security.sql   RLS policies
│   ├── 04_view.sql       movie_ratings view
│   └── 05_queries.sql    example queries
├── screenshots/
├── index.html
├── style.css
├── app.js
└── README.md
How to run
Create a project at supabase.com.
In the Supabase SQL Editor, run the scripts in database/ in order: 01_tables.sql, 02_seed.sql, 03_security.sql, 04_view.sql. 05_queries.sql holds example queries you can run any time.
In app.js, set your own Supabase project URL and anon (public) key.
Open the project folder in VS Code and start it with the Live Server extension (or any local web server), then open the page in your browser.
Build history

The project was built in phases, each one a separate commit: repo setup, tables, sample data, RLS policies, view and queries, website skeleton, loading movies from Supabase, search, language filter, movie detail view and reviews. Run git log --oneline to see them.

Author

Anandhakrishnan KS
