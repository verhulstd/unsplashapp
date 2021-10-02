import "../css/style.scss";

import { httpClient } from "./helpers";

/**
 * VARS
 */

const searchField = document.getElementById("searchbar");
const form = document.querySelector("form");
const cardTemplate = document.querySelector("template").innerHTML;
const grid = document.getElementById("cards");

/**
 * EVENTS
 */

form.onsubmit = function (e) {
  e.preventDefault();
  const { value } = searchField;
  if (value.length > 3) {
    httpClient(`/search/photos?query=${value}`).then((response) => {
      grid.innerHTML = response.data.results
        .map((unsplashObj) =>
          cardTemplate
            .replace("#CARD_IMAGE_URL", unsplashObj.urls.thumb)
            .replace("#CARD_PROFILE", "")
            .replaceAll("#CARD_TEXT", unsplashObj.alt_description)
        )
        .join("");
    });
  }
};

//alt_description
