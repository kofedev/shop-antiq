import {Component, HostListener} from '@angular/core';
import {Router} from "@angular/router";
import {CategoryService} from "../../../services/category.service";
import {UiElementService} from "../../../services/ui-element.service";
import {ProductService} from "../../../services/product.service";

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.scss'
})
export class SearchProductComponent {

  // search: string = '';        // field variable
  queryString: string = '';

  constructor(private router: Router,
              private categoryService: CategoryService,
              public ui: UiElementService,
              public productService: ProductService) { }

  searchGo() {

    this.productService.searchString = this.productService.searchString.replace(/[^\p{L}\p{N}\s]/gu, '');

    if (this.productService.searchString.trim().length === 0) {
      this.resetSearch();
      return;
    }
    // if (this.search.trim().length === 0) {
    //   this.resetSearch();
    //   return;
    // }
    //@ToDo current category!!
    // this.queryString = '';
    // this.queryString = '?categoryId=' + this.getCurrentCategoryIdOrRoot() + '&search=' + this.search.trim();
    this.queryString = '?categoryId=' + this.getCurrentCategoryIdOrRoot() + '&search=' + this.productService.searchString.trim();
    this.callProductExplorer(this.queryString);
  }

  resetSearch() {
    // this.search = '';
    this.productService.searchString = '';
    this.queryString = '?categoryId=' + this.getCurrentCategoryIdOrRoot();
    this.callProductExplorer(this.queryString);
  }

  callProductExplorer(query: string) {
    const urlString = encodeURIComponent(query);
    this.router.navigateByUrl("/product/explore/" + urlString).then(r => {});
  }

  getCurrentCategoryIdOrRoot () {
    if (this.categoryService._global_current_category_id) {
      return this.categoryService._global_current_category_id;
    } else {
      return this.categoryService._global_root_category_id;
    }
  }

  onInputFocus() {
    this.searchGo();
  }

}
