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
      <p>Nenhum resultado encontrado.</p>
    </div>`;
  }
}
