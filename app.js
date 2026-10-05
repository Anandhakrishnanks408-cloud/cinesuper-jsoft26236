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
    <div class="movie-card">
      <img src="${movie.poster_url}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.release_year} · ${movie.language}</p>
      </div>
    </div>
  `).join("");
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
  renderMovies(allMovies);
}

document.getElementById("search").addEventListener("input", (e) => {
  const text = e.target.value.toLowerCase();
  const filtered = allMovies.filter(movie =>
    movie.title.toLowerCase().includes(text)
  );
  renderMovies(filtered);
});

loadMovies();