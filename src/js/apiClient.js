import Meal from "./meal.js";

const loading = $("#loadingIndicator");
function toggleLoadingScreen() {
  const heightInputs = $("#searchInputs")?.outerHeight(true) + 25;
  loading.toggleClass("hidden").animate({ top: heightInputs || 0 }, 0);
}

export function getMeals(query, byCharacter = false) {
  toggleLoadingScreen();
  const type = byCharacter ? "f" : "s";
  const databaseLink = `https://www.themealdb.com/api/json/v1/1/search.php?${type}=${query}`;
  return fetch(databaseLink)
    .then((res) => res.json())
    .then((data) => {
      const listMeals = [];
      data.meals.forEach((meal) => {
        listMeals.push(new Meal(meal));
      });
      toggleLoadingScreen();

      return listMeals;
    })
    .catch((err) => {
      console.error("Error: ", err);
      toggleLoadingScreen();

      return [];
    });
}

export function getMealDetails(idMeal) {
  toggleLoadingScreen();

  return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
    .then((res) => res.json())
    .then((data) => {
      toggleLoadingScreen();

      return data.meals[0];
    })
    .catch((error) => {
      console.error("Error: ", error);
      toggleLoadingScreen();
    });
}
