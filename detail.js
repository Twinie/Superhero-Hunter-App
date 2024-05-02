const superHeroList = document.querySelector(".superhero-detail-wrap");
const publicKey = "f7e4bcda8599f047bf210e922b0806f9";
const prvtKey = "19c90f9fb46aa5a0452f8dd058345d777d7a5a2a";
const ts = new Date().getTime();
let url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${CryptoJS.MD5(
  `${ts}${prvtKey}${publicKey}`
).toString()}`;

//async function to call API
const characterDetail = async () => {
  const response = await fetch(url);
  const marvelChar = await response.json();
  const listOfCharacters = marvelChar.data.results;

  renderDetails(listOfCharacters);
};
characterDetail();

//render more info about the superhero after the API is called
function renderDetails(items) {
  let checkId;

  /* The part of href i.e. the id present in href is searched in the response we get from API call
  and if present we get that item(object) and hence rendering the details required to show */
  const paramsString = window.location.href;
  const searchParams = new URLSearchParams(paramsString);
  for (const p of searchParams) {
    checkId = p[1];
  }
  let foundItem = items.find((item) => {
    return item.id === Number(checkId);
  });
  // console.log(foundItem);

  let comicNames = "";
  let eventNames = "";
  let storyNames = "";
  let seriesNames = "";

  /* the foundItem variable has object whose values need to be displayed, the values which is the array of items,
  the forEach loop helps store the items in the variables and that is merged inside the HTML */
  foundItem.comics.items.forEach((item) => {
    comicNames += `<li>${item.name}</li>`;
  });
  foundItem.events.items.map((item) => {
    eventNames += `<li>${item.name}</li>`;
  });
  foundItem.series.items.map((item) => {
    storyNames = `<li>${item.name}</li>`;
  });
  foundItem.stories.items.map((item) => {
    seriesNames += `<li>${item.name}</li>`;
  });
  superHeroList.innerHTML = `<div class="detail-container"> 
  <div class="img-container">
  <img class="detail-img" src='${foundItem.thumbnail.path}.${foundItem.thumbnail.extension}' alt="superhero-image" /> 
  </div>
  <div class="info-container">
  <h1> <h3 class="title"> Name: </h3> ${foundItem.name} </h1>
  <p> <h3 class="title"> Description: </h3> ${foundItem.description} </p>
  <ul> <h3 class="title"> Comics: </h3> ${comicNames} </ul>
  <ul> <h3 class="title"> Events: </h3> ${eventNames} </ul>
  <ul> <h3 class="title"> Series: </h3> ${seriesNames} </ul>
  <ul> <h3 class="title"> Stories: </h3> ${storyNames} </ul>
  </div>
  </div>`;
}
