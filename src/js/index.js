import "../css/style.scss";

import { httpClient, preloadImage, preloadImages } from "./helpers";

/**
 * VARS
 */

const searchField = document.getElementById("searchbar");
const form = document.querySelector("form");
const cardTemplate = [...document.querySelectorAll("template")][0].innerHTML;
const likeTemplate = [...document.querySelectorAll("template")][1].innerHTML;
const grid = document.getElementById("cards");
const likeZone = document.querySelector(".likes");
const inputZone = document.querySelector("#wrapperforicon");
const likedPictures = [];

/**
 * EVENTS
 */
form.onsubmit = async function (e) {
  e.preventDefault();
  const { value } = searchField;
  if (value.length > 3) {
    // fetch uitvoeren
    const response = await httpClient(`/search/photos?query=${value}`);
    inputZone.classList.add("loading");
    form.disabled = true;
    await preloadImages(
      response.data.results.map((unsplashObj) => unsplashObj.urls.thumb)
    );
    inputZone.classList.remove("loading");
    form.disabled = false;
    //loader weghalen
    //grid opbouwen
    grid.innerHTML = response.data.results
      .map((unsplashObj) =>
        cardTemplate
          .replaceAll("#CARD_IMAGE_URL", unsplashObj.urls.thumb)
          .replace("#CARD_PROFILE", "")
          .replace("#ID", unsplashObj.id)
          .replaceAll("#CARD_TEXT", unsplashObj.alt_description)
      )
      .join("");
  }
  // hoeveel fotos zijn er?
  // fetch results in grid plaatsen
};

grid.onclick = (e) => {
  if (e.target.classList.contains("starwrapper")) {
    ///die bewust card zijn id en thumbfoto opvragen
    setLike(e.target.dataset.id, e.target.dataset.thumb);
    e.target.classList.add("active");
  }
};

function setLike(id, thumb) {
  likedPictures.push({
    id,
    thumb,
  });
  // //
  // XXX.innerHTML = XXX.map()
  // map alle likes en plaats x aantal liketemplates in de likeZone
}
