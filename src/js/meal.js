export default class Meal {
  constructor(meal) {
    this.id = meal.idMeal;
    this.name = meal.strMeal;
    this.srcImg = meal.strMealThumb;
    this.instructions = meal.strInstructions;
    this.area = meal.strArea;
    this.category = meal.strCategory;
    this.recipes = this.getRecipes(meal);
    this.tags = meal.strTags?.split(",").map((tag) => tag.trim());
    this.mealSrc = meal.strSource;
    this.mealYT = meal.strYoutube;
  }

  getRecipes(meal) {
    let recipes = [];
    for (let i = 1; i < 21; i++) {
      const nameMeasure = `strMeasure${i}`;
      const nameIngredient = `strIngredient${i}`;
      const measure = meal[nameMeasure];
      const ingredient = meal[nameIngredient];

      if (measure && ingredient) {
        let recipe;
        if (measure.slice(-1) === " ") {
          recipe = `${measure}${ingredient}`;
        } else {
          recipe = `${measure} ${ingredient}`;
        }
        recipes.push(recipe);
      }
    }
    recipes = recipes.filter((recipe) => recipe != "  ");
    return recipes;
  }
}
