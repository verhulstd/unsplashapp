import "../css/style.scss";

import { httpClient, preloadImage, preloadImages } from "./helpers";

/**
 * VARS
 */

const searchField = document.getElementById("searchbar");
const form = document.querySelector("form");
const cardTemplate = document.querySelector("template").innerHTML;
const grid = document.getElementById("cards");
const inputZone = document.querySelector("#wrapperforicon");
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
          .replace("#CARD_IMAGE_URL", unsplashObj.urls.thumb)
          .replace("#CARD_PROFILE", "")
          .replaceAll("#CARD_TEXT", unsplashObj.alt_description)
      )
      .join("");
  }

  // hoeveel fotos zijn er?
  // fetch results in grid plaatsen
};

//alt_description
