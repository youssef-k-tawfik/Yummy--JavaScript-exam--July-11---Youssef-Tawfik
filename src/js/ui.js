import * as api from "./apiClient.js";
import Meal from "./meal.js";

const dataContainer = $("#dataRow");

export function displayMeals(listMeals) {
  dataContainer.html("");

  function generateMeal({ srcImg, name, id }) {
    return `
      <div class="meal">
        <div data-id=${id} class="img-container">
          <img src="${srcImg}" alt="${name} Meal" />
          <div class="meal-overlay">${name}</div>
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
  // & Meal Details
  $(".img-container").on("click", function (e) {
    const idMeal = e.currentTarget.dataset.id;
    api
      .getMealDetails(idMeal)
      .then((meal) => {
        showMealDetails(new Meal(meal));
      })
      .catch((error) => console.error("Error: ", error));
  });

  // & search event
  $("#mealSearchInput").on("input", function () {
    debouncedSearch.call(this, false);
  });
  $("#mealCharacterSearchInput").on("input", function () {
    debouncedSearch.call(this, true);
  });

  // & Category Details
  $(".category-img-container").on("click", function (e) {
    const category = e.currentTarget.dataset.id;
    api
      .getMealsByCategory(category)
      .then((listMeals) => {
        displayMeals(listMeals);
      })
      .catch((error) => console.error("Error: ", error));
  });

  // & Areas
  $(".area").on("click", function (e) {
    const clickedArea = e.currentTarget.dataset.area;
    api
      .getMealsByArea(clickedArea)
      .then((listMeals) => {
        displayMeals(listMeals);
      })
      .catch((error) => console.error("Error: ", error));
  });

  // & Ingredients
  $(".ingredient").on("click", function (e) {
    const clickedIngredient = e.currentTarget.dataset.ingredient;
    api
      .getMealsByIngredient(clickedIngredient)
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
        <div data-id=${name} class="category-img-container">
          <img src="${srcImg}" alt="${name} Category" />
          <div  class="category-overlay">
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

export function displayIngredients(listIngredients) {
  dataContainer.html("");
  function generateIngredient({ name, description }) {
    return `
    <div data-ingredient="${name}" class="meal text-center ingredient">
      <div class="cursor-pointer">
        <i class="fa-solid fa-drumstick-bite font-black text-6xl"></i>
        <h2 class="text-2xl font-medium">${name}</h2>
        <p>${description}</p>
      </div>
    </div>
    `;
  }
  listIngredients.forEach((ingredient) =>
    dataContainer.html(dataContainer.html() + generateIngredient(ingredient))
  );
  addListeners();
}

export function displaySignUpForm() {
  dataContainer.html(`
      <form class="text-black w-full flex flex-wrap justify-center gap-6">
        <div class="w-[90%] mx-auto md:mx-0 md:w-[40%]">
          <input
            type="text"
            id="inputName"
            class="bg-white border outline-0 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Your Name"
            required
          />
          <div class="alert hidden">
            <p>Special characters and numbers not allowed</p>
          </div>
        </div>
        <div class="w-[90%] mx-auto md:mx-0 md:w-[40%]">
          <input
            type="email"
            id="inputEmail"
            class="bg-white border outline-0 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Your Email"
            required
          />
          <div class="alert hidden">
            <p>Email not valid *exemple@yyy.zzz</p>
          </div>
        </div>
        <div class="w-[90%] mx-auto md:mx-0 md:w-[40%]">
          <input
            type="text"
            id="inputPhone"
            class="bg-white border outline-0 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Your Phone"
            required
          />
          <div class="alert hidden">
            <p>Enter valid Phone Number</p>
            <p>*example +201234567879</p>
            <p>*example 01234567879</p>
          </div>
        </div>
        <div class="w-[90%] mx-auto md:mx-0 md:w-[40%]">
          <input
            type="number"
            id="inputAge"
            class="bg-white border outline-0 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Your Age"
            required
          />
          <div class="alert hidden">
            <p>Enter valid age between 13 and 120</p>
          </div>
        </div>
        <div class="w-[90%] mx-auto md:mx-0 md:w-[40%]">
          <input
            type="password"
            id="inputPW"
            class="bg-white border outline-0 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Enter Your Password"
            required
          />
          <div class="alert hidden">
            <p>
              Enter valid password *Minimum eight characters, at least one
              letter and one number:*
            </p>
          </div>
        </div>
        <div class="w-[90%] mx-auto md:mx-0 md:w-[40%]">
          <input
            type="password"
            id="inputRewritePW"
            class="bg-white border outline-0 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Re-write your password"
            required
          />
          <div class="alert hidden">
            <p>Enter valid repassword</p>
          </div>
        </div>
        <div id="formBtn" class="w-full text-center">
          <button
            disabled
            class="enabled:hover:bg-red-600 enabled:hover:border-red-600 enabled:hover:text-white transition-colors duration-300 py-2 px-4 border border-red-600 text-red-600 disabled:border-red-900 disabled:text-red-900 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    `);
  dataContainer.addClass("form-container");

  // * toggle inputs shadow effect
  $("form input").on("focus", function () {
    $(this).addClass("input-focused");
  });
  $("form input").on("focusout", function () {
    $(this).removeClass("input-focused");
  });

  $("form").on("submit", (e) => e.preventDefault());

  $("form input").on("input", function () {
    const input = $(this);
    const inputValue = input.val();
    const valid = validateInput(input[0], inputValue);

    if (!valid) {
      input.next().removeClass("hidden");
    } else {
      input.next().addClass("hidden");
    }
    if (
      validateInput($("form input").eq(0)[0], $("form input").eq(0).val()) &&
      validateInput($("form input").eq(1)[0], $("form input").eq(1).val()) &&
      validateInput($("form input").eq(2)[0], $("form input").eq(2).val()) &&
      validateInput($("form input").eq(3)[0], $("form input").eq(3).val()) &&
      validateInput($("form input").eq(4)[0], $("form input").eq(4).val()) &&
      validateInput($("form input").eq(5)[0], $("form input").eq(5).val())
    ) {
      $("#formBtn button").attr("disabled", false);
    }
  });
}

function validateInput(input, value) {
  const inputName = $("#inputName")[0];
  const inputEmail = $("#inputEmail")[0];
  const inputPhone = $("#inputPhone")[0];
  const inputAge = $("#inputAge")[0];
  const inputPW = $("#inputPW")[0];
  const inputRePW = $("#inputRewritePW")[0];

  let regex;
  switch (input) {
    case inputName:
      regex = /^[a-zA-Z\s]+$/;
      break;
    case inputEmail:
      regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      break;
    case inputPhone:
      regex = /^(?:\+201[0125]|01[0125])\d{8}$/;
      break;
    case inputAge:
      regex = /^(1[3-9]|[2-9]\d|1[01]\d|120)$/;
      break;
    case inputPW:
      regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      break;
    case inputRePW:
      return inputRePW.value === inputPW.value;

    default:
      break;
  }
  return regex.test(value);
}
