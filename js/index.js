/**
 * SEARCH BAR IMPLEMENTATION
 */

// Page components
const textInput = document.getElementById("search-input");
const autoComplete = document.getElementById("autocomplete");

// Interactions
textInput.addEventListener("input", () => searchByName(textInput.value));

// Functions
async function searchByName(input) {
  const request = await fetch("../json/all.json");
  const json = await request.json();
  const sortedPokemons = json.results;

  let matches = sortedPokemons.filter((pokemon) => {
    const regex = new RegExp(`^${input}`, "gi");
    return pokemon.name.match(regex);
  });

  if (input.length === 0) {
    matches = [];
    autoComplete.innerHTML = "";
  }

  outputHtml(matches);
}

function outputHtml(matches) {
  if (matches.length > 0) {
    const html = matches
      .map((match) => {
        let pokeName = match.name;
        let upperName = pokeName.charAt(0).toUpperCase() + pokeName.slice(1);
        return `
          <div class="search_card">
            <a href="/pokemon.html?id=${match.url.slice(
              34,
              -1
            )}">${upperName}</a>
          </div>`;
      })
      .join("");

    autoComplete.innerHTML = html;
  } else if (matches.length == 0 && textInput.value) {
    autoComplete.innerHTML = `<div class="search_card">
      <p>No results were found.</p>
    </div>`;
  }
}

/**
 * DINAMIC POKEMON CARDS RENDERING
 */

const container = document.getElementById("container");
let nextPage = "";

// INTERACTION
getPokemons("https://pokeapi.co/api/v2/pokemon?limit=15");

// FUNCTIONS
async function getPokemons(queryUrl) {
  // Get request
  const response = await fetch(queryUrl);
  const info = await response.json();
  // Next page update
  nextPage = info.next;
  // Dinamic generation of pokemon cards
  for (let item of info.results) {
    const query = await fetch(item.url);
    const result = await query.json();
    const img = result.sprites.other["official-artwork"].front_default;
    createPokemon(result.id, result.name, result.types, img);
  }
  load.classList.toggle("invisible");
}

function createPokemon(id, name, types, img) {
  const card = document.createElement("div");
  card.classList.add("card");

  let typesHtml = "";
  for (let item of types) {
    typesHtml += `
      <div class="type_border type_${item.type.name}">
        <img src="assets/icons/${item.type.name}.svg" />
      </div>
    `;
  }

  card.innerHTML = `
  <div class="poke_info">
    <p>No. ${id}</p>
    <a href="/pokemon.html?id=${id}"><h2>${name}</h2></a>
    <div>
      ${typesHtml}
    </div>
  </div>
  <div class="poke_img">
    <a href="/pokemon.html?id=${id}"><img src="${img}" alt="Bulbasaur" /></a>
  </div>
  `;

  container.appendChild(card);
}

/**
 * INFINITE SCROLL IMPLEMENTATION
 */

const loadObserver = new IntersectionObserver(
  (entries) => {
    const loadIcon = entries[0];
    if (!loadIcon.isIntersecting) return;
    load.classList.toggle("invisible");
    getPokemons(nextPage);
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  }
);

const load = document.getElementById("load");
loadObserver.observe(load);
