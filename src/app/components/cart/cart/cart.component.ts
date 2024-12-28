import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {Cart} from "../../../model/cart";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {

  currentQuantity: number = 0;
  sub_cartLocalDbIsUpdated$!: Subscription;

  constructor(private cartService: CartService,
              private router: Router) { }

  ngOnDestroy() {
    if (this.sub_cartLocalDbIsUpdated$) this.sub_cartLocalDbIsUpdated$.unsubscribe();
  }

  ngOnInit(): void {
    this.currentQuantity = this.getItemsQuantity(this.cartService.cart);
    this.sub_cartLocalDbIsUpdated$ = this.cartService.cartLocalDbIsUpdated$.subscribe({
      next: value => {
        this.currentQuantity = this.getItemsQuantity(this.cartService.cart);

      }
    })
  }

  getItemsQuantity(cart: Cart): number {
    return this.cartService.cart.cartCells.length;
  }

  goToCartPage() {
    this.router.navigateByUrl("/cart").then(r => {});
  }


}

