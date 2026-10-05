const SUPABASE_URL = "https://kmweghmcnnmfjtglqjtg.supabase.co";
const SUPABASE_KEY = "sb_publishable_6Pxf5Mg_FoiIHXCFzY_TCw_oD-RgXD4";

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
loadMovies();