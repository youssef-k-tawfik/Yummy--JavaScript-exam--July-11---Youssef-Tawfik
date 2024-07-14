import * as api from "./apiClient.js";
import Meal from "./meal.js";

const dataContainer = $("#dataRow");

export function displayMeals(listMeals) {
  dataContainer.html("");

  function generateMeal({ srcImg, name, id }) {
    return `
      <div class="meal">
        <div class="img-container">
          <img src="${srcImg}" alt="${name} Meal" />
          <div data-id=${id} class="meal-overlay">${name}</div>
        </div>
      </div>
    `;
  }

  listMeals.forEach((meal) =>
    dataContainer.html(dataContainer.html() + generateMeal(meal))
  );

  addListeners();
}

function showMealDetails({
  name,
  srcImg,
  instructions,
  area,
  category,
  recipes,
  tags,
  mealSrc,
  mealYT,
}) {
  function generateRecipe(recipeName) {
    return `<div class="recipe">${recipeName}</div>`;
  }
  function generateTag(tagName) {
    return `<div class="tag">${tagName}</div>`;
  }

  dataContainer.html(`
      <div class="w-1/3 p-2">
        <div class="img-container">
          <img src="${srcImg}" alt="${name} meal" />
        </div>
        <h1 class="text-3xl font-medium">${name}</h1>
      </div>
      <div id="mealDetails" class="w-2/3 p-2">
        <h2 class="text-3xl font-medium mb-2">Instructions</h2>
        <p class="mb-4">${instructions}</p>
        <h2 class="section-heading font-bold">
          Area : <span class="font-medium">${area}</span>
        </h2>
        <h2 class="section-heading font-bold">
          Category : <span class="font-medium">${category}</span>
        </h2>
        <h2 class="section-heading font-medium">Recipes :</h2>
        <div id="recipesContainer" class="flex flex-wrap gap-2 mb-4">
        </div>
        <h2 class="section-heading font-medium">Tags :</h2>
        <div id="tagsContainer" class="flex flex-wrap gap-2 mb-4">
        </div>
        <div id="mealLinks" class="pt-4">
          <a aria-roledescription="button" class="btn bg-[#198754] hover:bg-[#157347]" href="${mealSrc}" target="_blank">Source</a>
          <a aria-roledescription="button" class="btn bg-[#dc3545] hover:bg-[#bb2d3b]" href="${mealYT}" target="_blank">Youtube</a>
        </div>
      </div>
    `);
  recipes.forEach((recipe) =>
    $("#recipesContainer").html(
      $("#recipesContainer").html() + generateRecipe(recipe)
    )
  );
  tags.forEach((tag) =>
    $("#tagsContainer").html($("#tagsContainer").html() + generateTag(tag))
  );
}

export function displayInputs() {
  $("body").prepend(`
    <div id="searchInputs" class="w-full flex justify-center gap-3">
      <div class="input-container">
        <input
          type="text"
          id="mealSearchInput"
          placeholder="Search By Name"
          class="searchInput"
        />
      </div>
      <div class="input-container">
        <input
          type="text"
          id="mealCharacterSearchInput"
          placeholder="Search By First Letter"
          class="searchInput"
          maxlength="1"
        />
      </div>
    </div>
    `);
  dataContainer.html("");
  addListeners();
}

function addListeners() {
  // * Meal Details
  $(".meal-overlay").on("click", function (e) {
    const idMeal = e.target.dataset.id;
    api
      .getMealDetails(idMeal)
      .then((meal) => {
        showMealDetails(new Meal(meal));
      })
      .catch((error) => console.error("Error: ", error));
  });

  // * search event
  $("#mealSearchInput").on("input", function () {
    debouncedSearch.call(this, false);
  });
  $("#mealCharacterSearchInput").on("input", function () {
    debouncedSearch.call(this, true);
  });

  // * Category Details
  $(".category-overlay").on("click", function (e) {
    const category = e.currentTarget.dataset.id;
    api
      .getMealsByCategory(category)
      .then((listMeals) => {
        displayMeals(listMeals);
      })
      .catch((error) => console.error("Error: ", error));
  });

  // * Areas
  $(".area").on("click", function (e) {
    const clickedArea = e.currentTarget.dataset.area;
    api
      .getMealsByArea(clickedArea)
      .then((listMeals) => {
        displayMeals(listMeals);
      })
      .catch((error) => console.error("Error: ", error));
  });
}

const debouncedSearch = debounce(function (byCharacter = false) {
  const searchQuery = $(this)[0].value;
  api
    .getMeals(searchQuery, byCharacter)
    .then((listMeals) => displayMeals(listMeals))
    .catch((error) => console.error("Error: ", error));
}, 300);

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

export function displayCategories(listCategories) {
  dataContainer.html("");
  function generateCategory({ name, srcImg, description }) {
    return `
      <div class="meal">
        <div class="img-container">
          <img src="${srcImg}" alt="${name} Category" />
          <div data-id=${name} class="category-overlay">
          <h2 class="">${name}</h2>
          <p>${description}</p>
          </div>
        </div>
      </div>
    `;
  }
  listCategories.forEach((category) =>
    dataContainer.html(dataContainer.html() + generateCategory(category))
  );
  addListeners();
}

export function displayAreas(listAreas) {
  dataContainer.html("");
  function generateArea(area) {
    return `
    <div data-area="${area}" class="meal text-center area">
      <div class="cursor-pointer">
        <i class="fa-solid fa-house-laptop font-black text-6xl"></i>
        <h2 class="text-2xl font-medium">${area}</h2>
      </div>
    </div>
    `;
  }
  listAreas.forEach((area) =>
    dataContainer.html(dataContainer.html() + generateArea(area))
  );
  addListeners();
}
