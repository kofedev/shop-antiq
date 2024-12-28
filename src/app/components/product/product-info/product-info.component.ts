import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../../services/product.service";
import {Product} from "../../../model/product";
import {CurrentLanguageService} from "../../../services/current-language.service";
import {CartService} from "../../../services/cart.service";
import {CartCell} from "../../../model/cart-cell";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrl: './product-info.component.scss'
})
export class ProductInfoComponent implements OnInit, OnDestroy {

  params$!: Subscription;
  getProductById_full$!: Subscription;
  productId!: number;
  quantitySelected!: number;
  product!: Product;

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              public currentLanguageService: CurrentLanguageService,
              public cartService: CartService,
              public ui: UiElementService) {}

  ngOnDestroy(): void {
    if (this.params$) this.params$.unsubscribe();
    if (this.getProductById_full$) this.getProductById_full$.unsubscribe();
  }
  ngOnInit(): void {
    // Access the route parameter
    this.params$ = this.route.params.subscribe(params => {
      this.productId = +params['productId'];
      if (this.productId) {
        this.loadProductById(this.productId);
      } else {
        console.log("Parameter (product ID) has been not retrieved");
      }

    });
  }

  loadProductById (productId: number) {
    this.getProductById_full$ = this.productService.getProductById_full(productId).subscribe({
      next: value => {
        this.product = structuredClone(value);
        this.product.isAddedToCart = this.isExistInCart(this.product.productId);
      }
    })

  }

  //@ToDo ---- to service
  isExistInCart (productId: number) {
    for (let cartCell of this.cartService.cart.cartCells) {
      if (productId === cartCell.product.productId) return true;
    }
    return false;
  }

  //@ToDo ---- to service
  addToWishes () {
    let cartCell: CartCell = {
      quantity: this.quantitySelected,
      product: this.product
    };
    this.product.isAddedToCart = true;
    if (!this.cartService.cart.cartCells) this.cartService.cart.cartCells = [];
    this.cartService.cart.cartCells.push(cartCell);
    this.cartService.saveCart(this.cartService.cart).then(r => {
      this.cartService.cartLocalDbIsUpdated$.next(Math.random());
    });
  }

  returnToList() {
    window.history.back();
  }

}
