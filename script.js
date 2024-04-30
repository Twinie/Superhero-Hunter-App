const publicKey = "f7e4bcda8599f047bf210e922b0806f9";
const prvtKey = "19c90f9fb46aa5a0452f8dd058345d777d7a5a2a";
const ts = new Date().getTime();
const superheroCont = document.querySelector(".superhero-wrapper");
const superHeroList = document.querySelector(".superhero-list");
const searchInput = document.getElementById("query");
const searchSubmit = document.querySelector(".search-btn");
let superHeroId = 0;
let favArray = [];

let url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${CryptoJS.MD5(
  `${ts}${prvtKey}${publicKey}`
).toString()}`;
console.log(url);
// let listOfCharacters = [];
const characterDetail = async () => {
  const response = await fetch(url);
  const marvelChar = await response.json();
  const listOfCharacters = marvelChar.data.results;
  console.log(listOfCharacters);
  filterData(listOfCharacters);
  renderDetails(listOfCharacters);
};
characterDetail();

function renderDetails(superheroes) {
  // console.log(listOfCharacters);
  superheroes.forEach((superHero, ind) => {
    let newDiv = document.createElement("div");
    superHeroId += 1;
    newDiv.innerHTML = `<div> <img class="superhero-img" src='${superHero.thumbnail.path}.${superHero.thumbnail.extension}' /> </div>`;

    // <div class="superhero-info"> <div> <a href="superhero-page" class="superhero-detail"> ${superHero.name} </a>
    // </div>  <button class="fav-btn"> <i class="fa fa-heart"></i> </button> </div>`;
    newDiv.classList.add("superhero");
    newDiv.setAttribute("data-id", superHeroId);
    let superheroInfoDiv = document.createElement("div");
    superheroInfoDiv.classList.add("superhero-info");
    let superheroAnchor = document.createElement("a");
    superheroAnchor.classList.add("superhero-detail");
    superheroAnchor.setAttribute("href", "/");
    superheroAnchor.setAttribute("id", superHeroId);
    superheroAnchor.textContent = superHero.name;
    superheroInfoDiv.append(superheroAnchor);
    let favBtn = document.createElement("button");
    favBtn.textContent = "Add to Favourites";
    favBtn.setAttribute("id", superHeroId);
    superheroInfoDiv.append(favBtn);
    // let favBtn = document.querySelector(".superhero");
    // console.log(favBtn);
    favBtn.addEventListener("click", function () {
      favArray.push(superheroInfoDiv);
      // console.log(favArray);
    });
    superHeroList.append(newDiv);
    newDiv.append(superheroInfoDiv);
    // return newDiv;
    // return superHeroList;
  });
  // superHeroList.append(superHeroItem);
  // console.log(superHeroList);

  // return superHeroItem;
}
console.log(searchInput.value);

function filterData(superheroes) {
  searchInput.addEventListener("input", function (e) {
    console.log(searchInput.value);

    // e.preventDefault();
    let foundSuperhero = superheroes.filter((superhero) => {
      let searchName = superhero.name.toLowerCase();
      return searchName.includes(searchInput.value.toLowerCase());
      // return searchInput.value.equals(superhero.name);
    });
    console.log(foundSuperhero);
    superHeroList.textContent = "";
    renderDetails(foundSuperhero);
  });
}
