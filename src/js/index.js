import "../css/style.scss";

import {
  httpClient,
  preloadImage,
  preloadImages,
  saveToLocalStorage,
} from "./helpers";

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
const likedPictures = window.localStorage.getItem("unsplashapp-likes")
  ? JSON.parse(window.localStorage.getItem("unsplashapp-likes"))
  : [];
if (likedPictures.length) renderLikes();
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
    grid.querySelectorAll(".starwrapper").forEach((sw) => {
      if (likedPictures.map((el) => el.id).includes(sw.dataset.id)) {
        sw.classList.add("active");
      }
    });
  }
};

grid.onclick = (e) => {
  if (e.target.classList.contains("starwrapper")) {
    ///die bewust card zijn id en thumbfoto opvragen
    setLike(e.target.dataset.id, e.target.dataset.thumb);
    e.target.classList.add("active");
  }
};

likeZone.onclick = (e) => {
  if (e.target.classList.contains("starwrapper")) {
    const id = e.target.dataset.id;
    const foundIndex = likedPictures.findIndex((likeObj) => likeObj.id === id);
    likedPictures.splice(foundIndex, 1);
    saveToLocalStorage("unsplashapp-likes", likedPictures);
    renderLikes();
    //weghalen van .active
    // grid.querySelectorAll(".active").forEach((el) => {
    //   if (el.dataset.id === id) {
    //     el.classList.remove("active");
    //   }
    // });
    document.querySelector(`[data-id=${id}]`).classList.remove("active");
  }
};

function setLike(id, thumb) {
  likedPictures.push({
    id,
    thumb,
  });
  saveToLocalStorage("unsplashapp-likes", likedPictures);

  renderLikes();
}
function renderLikes() {
  likeZone.innerHTML = likedPictures
    .map((el) =>
      likeTemplate.replace("#ID", el.id).replace("#CARD_IMAGE_URL", el.thumb)
    )
    .join("");
}
