import {Component, Input} from '@angular/core';
import {Product} from "../../../model/product";
import {CurrentLanguageService} from "../../../services/current-language.service";
import {Router} from "@angular/router";
import {CartService} from "../../../services/cart.service";
import {CartCell} from "../../../model/cart-cell";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-product-small',
  templateUrl: './product-small.component.html',
  styleUrl: './product-small.component.scss'
})
export class ProductSmallComponent {
  @Input() product!: Product;
  quantitySelected = 1; //@ToDo ATTENTION! QUANTITY IS 1 for this case only

  constructor(public currentLanguageService: CurrentLanguageService,
              private router: Router,
              public cartService: CartService,
              public ui: UiElementService) { }

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

  goToProductInfo () {
    this.router.navigateByUrl("/product/" + this.product.productId).then(r => {});
  }

}
