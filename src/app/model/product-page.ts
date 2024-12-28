import {Product} from "./product";
import {Category} from "./category";

export interface ProductPage {
  currentPage: number,
  totalPages: number,
  products: Product[],
  category: Category
}
