const publicKey = "f7e4bcda8599f047bf210e922b0806f9";
const prvtKey = "19c90f9fb46aa5a0452f8dd058345d777d7a5a2a";
const ts = new Date().getTime();
const superheroCont = document.querySelector(".superhero-wrapper");
const superHeroList = document.querySelector(".superhero-list");
const searchInput = document.getElementById("query");
const searchSubmit = document.querySelector(".search-btn");

let superHeroDetailsId;
let favSet = new Set();
let favArray = [];
//to get items present in local storage
const myStoredArray = JSON.parse(localStorage.getItem("myfavArray"));
if (myStoredArray) {
  favArray.push(...myStoredArray);
}

let url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${CryptoJS.MD5(
  `${ts}${prvtKey}${publicKey}`
).toString()}`;

//async function to call API
const characterDetail = async () => {
  const response = await fetch(url);
  const marvelChar = await response.json();
  const listOfCharacters = marvelChar.data.results;
  // console.log(listOfCharacters);
  filterData(listOfCharacters);
  renderDetails(listOfCharacters);
};
characterDetail();

//to render data on browser
function renderDetails(superheroes) {
  superheroes.forEach((superHero) => {
    let newDiv = document.createElement("div");
    newDiv.innerHTML = `<div> <img class="superhero-img" src='${superHero.thumbnail.path}.${superHero.thumbnail.extension}' /> </div>`;
    newDiv.classList.add("superhero");
    newDiv.setAttribute("data-id", superHero.id);
    let superheroInfoDiv = document.createElement("div");
    superheroInfoDiv.classList.add("superhero-info");
    let superheroAnchor = document.createElement("a");
    superheroAnchor.classList.add("superhero-detail");
    superheroAnchor.setAttribute("id", superHero.id);
    superheroAnchor.setAttribute("href", `./detail.html?id=${superHero.id}`);
    superheroAnchor.textContent = superHero.name;

    superheroInfoDiv.append(superheroAnchor);
    let favBtn = document.createElement("button");
    favBtn.textContent = "Add to Favourites";
    favBtn.setAttribute("id", superHero.id);
    superheroInfoDiv.append(favBtn);

    favBtn.addEventListener("click", function () {
      if (myStoredArray) {
        favArray.push(...myStoredArray, favBtn.id);

        let foundItem = myStoredArray.find((item) => {
          return item === favBtn.id;
        });
        if (foundItem) {
          alert("The Superhero is already added to Favourites");
        } else {
          favBtn.setAttribute("disabled", "true");
          alert("Added to Favourites");
        }
      } else {
        favArray.push(favBtn.id);
      }
      let favSet = new Set(favArray);
      localStorage.setItem("myfavArray", JSON.stringify([...favSet]));
    });

    superHeroList.append(newDiv);
    newDiv.append(superheroInfoDiv);
  });
}

//to filter data on entering the value to search bar
function filterData(superheroes) {
  searchInput.addEventListener("input", function (e) {
    console.log(searchInput.value);
    let foundSuperhero = superheroes.filter((superhero) => {
      let searchName = superhero.name.toLowerCase();
      return searchName.includes(searchInput.value.toLowerCase());
    });
    console.log(foundSuperhero);
    superHeroList.textContent = "";
    renderDetails(foundSuperhero);
  });
}
