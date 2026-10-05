
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allMovies = [];

function renderMovies(movies) {
  const grid = document.getElementById("movie-grid");

  if (movies.length === 0) {
    grid.textContent = "No movies found.";
    return;
  }

  grid.innerHTML = movies.map(movie => `
    <div class="movie-card" data-id="${movie.id}">
      <img src="${movie.poster_url}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.release_year} · ${movie.language}</p>
      </div>
    </div>
  `).join("");
}

let currentLanguage = "All";

function applyFilters() {
  const text = document.getElementById("search").value.toLowerCase();

  const filtered = allMovies.filter(movie => {
    const matchesTitle = movie.title.toLowerCase().includes(text);
    const matchesLanguage =
      currentLanguage === "All" || movie.language === currentLanguage;
    return matchesTitle && matchesLanguage;
  });

  renderMovies(filtered);
}

async function loadMovies() {
  const { data, error } = await db
    .from("movies")
    .select("*")
    .order("release_year", { ascending: false });

  if (error) {
    document.getElementById("movie-grid").textContent = "Could not load movies.";
    console.error(error);
    return;
  }

  allMovies = data;
  applyFilters();
}

document.getElementById("search").addEventListener("input", applyFilters);

document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  currentLanguage = btn.dataset.lang;

  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  applyFilters();
});
async function showDetail(id) {
  const { data: movie, error } = await db
    .from("movies")
    .select("*, genres(name)")
    .eq("id", id)
    .single();

  const { data: rating, error: ratingError } = await db
    .from("movie_ratings")
    .select("avg_rating, review_count")
    .eq("id", id)
    .single();
if (ratingError) console.error(ratingError);

  const content = document.getElementById("detail-content");

  if (error) {
    content.textContent = "Could not load details.";
    console.error(error);
  } else {
    const avg = rating && rating.avg_rating !== null ? rating.avg_rating : "No ratings yet";
    const count = rating ? rating.review_count : 0;

    content.innerHTML = `
      <h2>${movie.title}</h2>
      <p>${movie.release_year} · ${movie.language}</p>
      <p>Genre: ${movie.genres.name}</p>
      <p>Duration: ${movie.duration_min} min</p>
      <p>Average rating: ${avg}</p>
      <p>Reviews: ${count}</p>

      <form class="review-form" data-movie-id="${movie.id}">
        <h3>Add your review</h3>
        <input name="reviewer_name" type="text" placeholder="Your name" required>
        <select name="rating" required>
          <option value="">Rating</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Okay</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Bad</option>
        </select>
        <textarea name="comment" rows="2" placeholder="Comment (optional)"></textarea>
        <button type="submit">Submit review</button>
        <p class="review-msg" id="review-msg"></p>
      </form>
    `;
  }

  document.getElementById("detail").classList.remove("hidden");
}

document.getElementById("movie-grid").addEventListener("click", (e) => {
  const card = e.target.closest(".movie-card");
  if (!card) return;
  showDetail(card.dataset.id);
});

document.getElementById("detail-close").addEventListener("click", () => {
  document.getElementById("detail").classList.add("hidden");
});
document.getElementById("detail-content").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const movieId = Number(form.dataset.movieId);
  const msg = document.getElementById("review-msg");

  const { error } = await db.from("reviews").insert({
    movie_id: movieId,
    reviewer_name: form.reviewer_name.value.trim(),
    rating: Number(form.rating.value),
    comment: form.comment.value.trim() || null
  });

  if (error) {
    msg.textContent = "Could not save review.";
    console.error(error);
    return;
  }

  showDetail(movieId);
});
loadMovies();