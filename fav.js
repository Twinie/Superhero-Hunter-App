const publicKey = "f7e4bcda8599f047bf210e922b0806f9";
const prvtKey = "19c90f9fb46aa5a0452f8dd058345d777d7a5a2a";
const ts = new Date().getTime();
const superheroCont = document.querySelector(".superhero-wrapper");
const superHeroList = document.querySelector(".superhero-list");
let renderingFavSuperheroArr = [];
let myStoredArray = JSON.parse(localStorage.getItem("myfavArray"));

let url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${CryptoJS.MD5(
  `${ts}${prvtKey}${publicKey}`
).toString()}`;

//async function to call API
const characterDetail = async () => {
  const response = await fetch(url);
  const marvelChar = await response.json();
  const listOfCharacters = marvelChar.data.results;
  // console.log(listOfCharacters);
  displayFavourites(listOfCharacters);
  renderDetails();
};
characterDetail();

/* to push the items in renderingFavSuperheroArr after finding the "id present in myStoredArray" in the response we are 
getting from API call */
function displayFavourites(favItems) {
  myStoredArray = JSON.parse(localStorage.getItem("myfavArray"));
  // console.log(myStoredArray);
  if (!myStoredArray || myStoredArray.length === 0) {
    superheroCont.textContent = "No Favourites Added";
    return;
  }
  myStoredArray.forEach((itemId) => {
    let foundItemId = favItems.find((item) => {
      return item.id === Number(itemId);
    });
    // console.log(foundItemId);
    renderingFavSuperheroArr.push(foundItemId);
  });
}

//to render the renderingFavSuperheroArr array
function renderDetails() {
  // console.log(renderingFavSuperheroArr);
  renderingFavSuperheroArr.forEach((superHero) => {
    let newDiv = document.createElement("div");
    newDiv.innerHTML = `<div> <img class="superhero-img" src='${superHero.thumbnail.path}.${superHero.thumbnail.extension}' /> </div>`;
    newDiv.classList.add("superhero");
    newDiv.setAttribute("data-id", superHero.id);
    let superheroInfoDiv = document.createElement("div");
    superheroInfoDiv.classList.add("superhero-info");
    let superheroAnchor = document.createElement("a");
    superheroAnchor.classList.add("superhero-detail");
    superheroAnchor.setAttribute("href", `./detail.html?id=${superHero.id}`);
    superheroAnchor.setAttribute("id", superHero.id);
    superheroAnchor.textContent = superHero.name;

    superheroInfoDiv.append(superheroAnchor);
    let favBtn = document.createElement("button");
    favBtn.textContent = "Remove";
    favBtn.setAttribute("id", superHero.id);
    superheroInfoDiv.append(favBtn);
    favBtn.addEventListener("click", function () {
      favBtn.parentNode.parentNode.remove();
      let foundIndex = renderingFavSuperheroArr.findIndex((item) => {
        return item.id === Number(favBtn.id);
      });
      // console.log(foundIndex);
      renderingFavSuperheroArr.splice(foundIndex, 1);
      myStoredArray.splice(foundIndex, 1);
      localStorage.setItem("myfavArray", JSON.stringify(myStoredArray));
      myStoredArray = JSON.parse(localStorage.getItem("myfavArray"));
      if (myStoredArray.length === 0) {
        superheroCont.textContent = "No Favourites Added";
      }
    });

    superHeroList.append(newDiv);
    newDiv.append(superheroInfoDiv);
  });
}
