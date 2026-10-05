-- SCRIPT 6: PERSONALISATION - my own movies

insert into genres (name) values ('Thriller')
on conflict (name) do nothing;

insert into movies (title, release_year, language, duration_min, description, poster_url, genre_id)
values
('Movie Title 1', 2019, 'Malayalam', 140, 'One-line description.', null,
  (select id from genres where name = 'Thriller')),
('Movie Title 2', 2016, 'English', 120, 'One-line description.', null,
  (select id from genres where name = 'Thriller'));