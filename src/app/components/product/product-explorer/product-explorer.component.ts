import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Product} from "../../../model/product";
import {ProductService} from "../../../services/product.service";
import {CategoryService} from "../../../services/category.service";
import {CartService} from "../../../services/cart.service";
import {Category} from "../../../model/category";
import {CurrentLanguageService} from "../../../services/current-language.service";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-product-explorer',
  templateUrl: './product-explorer.component.html',
  styleUrl: './product-explorer.component.scss'
})
export class ProductExplorerComponent implements OnInit, OnDestroy {

  params$!: Subscription;
  getProductsByParameters$!: Subscription;
  getCategoryById$!: Subscription;
  queryString: string | undefined; // ?categoryId=
  queryStringLocal: string = '';
  public products!: Product[];
  // min!: number;
  // max!: number;
  min: number | undefined;
  max: number | undefined;
  currentPage!: number;
  totalPages!: number;
  sortOrder!: string;
  displayWidth: number = 1000;
  // currentCategoryId!: number;
  category!: Category;
  categoriesVisible = true;
  ready = false;
  isSearchingMode = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private productService: ProductService,
              public categoryService: CategoryService,
              private cartService: CartService,
              public currentLanguageService: CurrentLanguageService,
              public ui: UiElementService) {}

  ngOnDestroy() {
    if (this.params$) this.params$.unsubscribe();
    if (this.getProductsByParameters$) this.getProductsByParameters$.unsubscribe();
    if (this.getCategoryById$) this.getCategoryById$.unsubscribe();
  }

  ngOnInit(): void {
    this.displayWidth = window.innerWidth;
    // Access the route parameter
    this.params$ = this.route.params.subscribe(params => {
      this.queryString = params['querystring'];
      if (this.queryString) {
        // retrieve Min and Max if exist
        const minMatch = this.queryString.match(/\&min=(\d+)/);
        if (minMatch && minMatch[1]) {
          this.min = parseInt(minMatch[1], 10);
          console.log("MIN: " + this.min) /////////////////
        }
        const maxMatch = this.queryString.match(/\&max=(\d+)/);
        if (maxMatch && maxMatch[1]) {
          this.max = parseInt(maxMatch[1], 10);
          console.log("MAX: " + this.max) /////////////////
        }
        // retrieve a search string
        const match = this.queryString.match(/&search=([^&]+)/);
        // console.log('MATCH: ' + match)
        if (match && match[1]) {
          // yes, it is a searching mode
          this.productService.searchString = match[1];
          this.isSearchingMode = true;
        } else {
          // no, it is not a searching mode
          this.isSearchingMode = false;
        }

        // load product array
        this.loadProductArrayByParameters(this.queryString);
      } else {
        // using root in this case
        this.queryStringLocal = '?categoryId=' + this.categoryService._global_root_category_id;
        // this.currentCategoryId = this.categoryService._global_root_category_id;
        this.queryString = this.queryStringLocal;
        this.loadProductArrayByParameters(this.queryStringLocal);
      }
    });
  }

  loadProductArrayByParameters (queryStringTail: string) {
    this.getProductsByParameters$ = this.productService.getProductsByParameters(queryStringTail).subscribe({
      next: value => {
        this.currentPage = value.currentPage + 1;
        this.totalPages = value.totalPages;
        this.products = structuredClone(value.products);
        this.category = structuredClone(value.category);
        this.setMarkersAddedToCart();
        this.ready = true;
      }
    })
  }

  goToCategoryById (categoryId: number) {

    // clear searching if exist
    this.productService.searchString = '';
    let s = this.queryString!.replace(/&search=([^&]+)/, '');

    // go process
    let pattern = /(\?categoryId=\d+)/;
    let match = s.match(pattern);
    if (match) {
      let s1 = s.substring(match[1].length);
      this.queryString = "?categoryId=" + categoryId + s1;
      this.callProductExplorer(this.queryString);
    } else {
      console.log("Wrong query string");
    }
  }

  setMarkersAddedToCart() {
    for (let product of this.products) {
      for (let cartCell of this.cartService.cart.cartCells) {
        if (cartCell.product.productId === product.productId) {
          product.isAddedToCart = true;
        }
      }
    }
  }

  minmax() {
    this.queryString = this.queryString!.replace(/&min=\d+(\.\d+)?/g, '');
    this.queryString = this.queryString!.replace(/&max=\d+(\.\d+)?/g, '');
    if (this.min) {
      this.queryString = this.queryString + '&min=' + this.min;
    }
    if (this.max) {
      this.queryString = this.queryString + '&max=' + this.max;
    }

    this.callProductExplorer(this.queryString);
  }

  sortByPrice(order: string) {
    ////*** sortbyprice=asc or desc
    if (this.sortOrder) if (this.sortOrder === order) return;

    this.queryString = this.queryString!.replace(/&sortbyprice=(asc|desc)/g, '');

    let localQueryStringTail = '';
    localQueryStringTail = '&sortbyprice=' + order;
    this.queryString = this.queryString + localQueryStringTail;
    this.sortOrder = order;
    this.callProductExplorer(this.queryString);
  }

  callProductExplorer(query: string) {
    const urlString = encodeURIComponent(query);
    this.router.navigateByUrl("/product/explore/" + urlString).then(r => {});
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  navigateToPage(page: number): void {
    this.queryString = this.queryString!.replace(/&pagenum=\d+(\.\d+)?/g, '');
    // this.queryString = this.queryString!.replace(/&pagesize=\d+(\.\d+)?/g, '');
    // let queryStringTail = '&pagesize=' + this.currentPageSize + '&pagenum=' + (page - 1);
    let queryStringTail = '&pagenum=' + (page - 1);
    this.queryString = this.queryString + queryStringTail;
    this.callProductExplorer(this.queryString);
  }

  setQuantityPerPageAndCallExplorer(quantityToSet: number) {
    this.queryString = this.queryString!.replace(/&pagenum=\d+(\.\d+)?/g, '');
    this.queryString = this.queryString!.replace(/&pagesize=\d+(\.\d+)?/g, '');
    let queryStringTail = '';
    if (quantityToSet === 0) {
      // it's mean ALL PER ONE PAGE
    } else {
      queryStringTail = '&pagesize=' + quantityToSet + '&pagenum=0';
      // queryStringTail = queryStringTail + '&pagenum=0';
    }

    this.queryString = this.queryString + queryStringTail;
    this.callProductExplorer(this.queryString);
  }

  resetSearch () {
    this.productService.searchString = '';
    this.min = undefined;
    this.max = undefined;
    this.callProductExplorer("?categoryId=" + this.categoryService._global_root_category_id);
  }

  resetMinMax () {
    this.queryString = this.queryString!.replace(/&min=\d+(\.\d+)?/g, '');
    this.queryString = this.queryString!.replace(/&max=\d+(\.\d+)?/g, '');
    this.min = undefined;
    this.max = undefined;
    this.callProductExplorer(this.queryString);
  }


}
