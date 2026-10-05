-- SCRIPT 5: PRACTICE QUERIES Q1 TO Q8

-- Q1: All movies, newest first
select title, release_year, language
from movies
order by release_year desc;

-- Q2: Only Malayalam movies
select title, release_year, duration_min
from movies
where language = 'Malayalam'
order by release_year;

-- Q3: Each movie with its genre name (JOIN)
select m.title, g.name as genre
from movies m
join genres g on g.id = m.genre_id
order by g.name, m.title;

-- Q4: Number of movies per language (GROUP BY)
select language, count(*) as total_movies
from movies
group by language
order by total_movies desc;

-- Q5: Rated movies, best first (uses the view)
select title, avg_rating, review_count
from movie_ratings
where avg_rating is not null
order by avg_rating desc, review_count desc;

-- Q6: Every review with the movie title (JOIN)
select m.title, r.reviewer_name, r.rating, r.comment
from reviews r
join movies m on m.id = r.movie_id
order by m.title;

-- Q7: Average rating per language (LEFT JOIN + GROUP BY)
select m.language,
       count(r.id)             as total_reviews,
       round(avg(r.rating), 1) as avg_rating
from movies m
left join reviews r on r.movie_id = m.id
group by m.language
order by avg_rating desc nulls last;

-- Q8: Movies that have no reviews yet
select m.title, m.release_year
from movies m
left join reviews r on r.movie_id = m.id
where r.id is null
order by m.title;