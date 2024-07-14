export default class Ingredient {
  constructor({ idIngredient, strIngredient, strDescription }) {
    this.id = idIngredient;
    this.name = strIngredient;
    this.description = this.getDescription(strDescription);
  }
  getDescription(description) {
    return description?.split(" ").slice(0, 20).join(" ");
  }
}
