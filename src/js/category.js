export default class Category {
  constructor({ id, strCategory, strCategoryThumb, strCategoryDescription }) {
    this.id = id;
    this.name = strCategory;
    this.srcImg = strCategoryThumb;
    this.description = this.getDescription(strCategoryDescription);
  }
  getDescription(description) {
    return description.split(" ").slice(0, 20).join(" ");
  }
}
