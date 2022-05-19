// VARIABLES AND CONSTANTS
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const queryId = +urlParams.get("id");

// PAGE ELEMENTS
const pokeImg = document.querySelector(".pokemon_img");
const pokeInfo = document.querySelector(".pokemon_info");
const pokeId = document.querySelector("#pokemon-id");
const pokeName = document.querySelector("#pokemon-name");
const pokeTypes = document.querySelector("#pokemon-types");
const pokeHeight = document.querySelector("#height");
const pokeWeight = document.querySelector("#weight");
const pokeAbilities = document.querySelector("#abilities");
const pokePrev = document.querySelector("#previous");
const pokeNext = document.querySelector("#next");

// INTERACTIONS
pokeQuery(queryId);
paginate(queryId);

// FUNCTIONS
async function pokeQuery(id) {
  const input = id ? id : 1;
  // Get request
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
  const info = await response.json();
  const imgUrl = info.sprites.other["official-artwork"].front_default;

  // Dinamic generation of elements
  generateElements(
    imgUrl,
    info.name,
    info.id,
    info.types,
    info.height,
    info.weight,
    info.abilities
  );
}

function generateElements(imgUrl, name, id, types, height, weight, abilities) {
  // Main image
  let mainImg = new Image();
  mainImg.src = imgUrl;
  mainImg.alt = `${name}`;
  pokeImg.appendChild(mainImg);

  // Pokemon info: id, name, types
  pokeId.textContent = `No. ${id}`;

  const capName = name.charAt(0).toUpperCase() + name.slice(1);
  pokeName.textContent = `${capName}`;

  let typesInnerHtml = "";
  for (let type of types) {
    const typeName = type.type.name;
    typesInnerHtml += `
      <div class="type_border type_${typeName}">
        <img src="assets/icons/${typeName}.svg" /> ${typeName}
      </div>`;
  }
  pokeTypes.innerHTML = typesInnerHtml;

  // Details: height, weight and abilities
  const heighttoM = (height * 0.1).toFixed(1);
  pokeHeight.textContent = `${heighttoM} m`;

  const weightToKg = (weight * 0.1).toFixed(1);
  pokeWeight.textContent = `${weightToKg} kg`;

  let abilitiesInnerHtml = "";
  for (let item of abilities) {
    const ability = item.ability.name;
    const abilityCap = ability.charAt(0).toUpperCase() + ability.slice(1);
    abilitiesInnerHtml += `<div>${abilityCap}</div>`;
  }
  pokeAbilities.innerHTML = abilitiesInnerHtml;
}

function paginate(id) {
  const page = id ? id : 1;
  pokePrev.href = `/pokemon.html?id=${page - 1}`;
  pokeNext.href = `/pokemon.html?id=${page + 1}`;

  if (page == 1) {
    pokePrev.parentNode.style.display = "none";
  }
  if (page == 898) {
    pokeNext.parentNode.style.display = "none";
  }
}
