import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "../../../services/cart.service";
import {Router} from "@angular/router";
import {CurrentLanguageService} from "../../../services/current-language.service";
import {CartCell} from "../../../model/cart-cell";

import {Subscription} from "rxjs";
import {CountdownService} from "../../../services/countdown.service";
import {OrderService} from "../../../services/order.service";
import {UiElementService} from "../../../services/ui-element.service";
import {Cart} from "../../../model/cart";
import {UiBigElementService} from "../../../services/ui-big-element.service";
import {UiElementFull} from "../../../model/ui-element-full";
import {UiElement2} from "../../../model/ui-element-2";
import {EnvironmentService} from "../../../services/environment.service";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit, OnDestroy {

  name: string = '';
  email= '';
  phone: string = '';
  message: string = '';
  remainingTime!: number;
  countdownSubscription$!: Subscription;
  countdownStarterSubscription$!: Subscription;
  sendNewOrder$!: Subscription;
  readonly localStorageCountDown = "_cntm_";
  readonly timeLimitForCountDown = 60000; // 1 minute
  sendButtonIsFree = false;
  _askToConfirm = false;
  _showInfo = false;
  get2UiBigElementsByKey$!: Subscription;

  uiBigElementForMessageHeader!: UiElementFull;
  uiBigElementForMessageFooter!: UiElementFull;

  constructor(public cartService: CartService,
              private uiBigElementService: UiBigElementService,
              private router: Router,
              public currentLanguageService: CurrentLanguageService,
              private countdownService: CountdownService,
              private orderService: OrderService,
              public ui: UiElementService,
              private environment: EnvironmentService) { }

  ngOnInit() {
    this.loadDataForForm();
    // Check countdown
    const currentTime = new Date().getTime();
    let targetTimeInLocal = localStorage.getItem(this.localStorageCountDown);
    if (targetTimeInLocal) {
      let targetTime = parseInt(targetTimeInLocal, 10);
     if (currentTime < targetTime) {
       this.sendButtonIsFree = false;
       this.startCountdownByTargetTime(targetTime);
     }
    }

    // getting the parts of them email message for customer
    this.get2UiBigElementsByKey$ =
      this.uiBigElementService.getTwoUiBigElementsByKey(this.environment.bigUiElementKeyForHeader, this.environment.bigUiElementKeyForFooter)
        .subscribe({
          next: value => {
            this.uiBigElementForMessageHeader = value.elementOne;
            this.uiBigElementForMessageFooter = value.elementTwo;
          }
        });

    //Subscribe to the countdown
    this.countdownSubscription$ = this.countdownService.getCountdown().subscribe(
      (time: number) => {
        this.remainingTime = time;
        if (time <= 0) this.sendButtonIsFree = true;
      });
  }

  ngOnDestroy() {
    if (this.countdownSubscription$) this.countdownSubscription$.unsubscribe();
    if (this.countdownStarterSubscription$) this.countdownStarterSubscription$.unsubscribe();
    if (this.sendNewOrder$) this.sendNewOrder$.unsubscribe();
    if (this.get2UiBigElementsByKey$) this.get2UiBigElementsByKey$.unsubscribe();
  }

  // Method to start the countdown from the component
  startCountdown() {
    const targetTime = new Date().getTime() + this.timeLimitForCountDown;
    localStorage.setItem(this.localStorageCountDown, String(targetTime));
    this.sendButtonIsFree = false;
    this.startCountdownByTargetTime(targetTime);
  }

  startCountdownByTargetTime(targetTime: number) {
    this.countdownStarterSubscription$ = this.countdownService.startCountdown(targetTime).subscribe({
      next: value => {} });
  }

  goToProduct (productId: number) {
    this.router.navigateByUrl("/product/" + productId).then(r => {});
  }


  deleteFromCart(cartCellToDelete: CartCell) {
    const index = this.cartService.cart.cartCells.indexOf(cartCellToDelete);
    if (index !== -1) {
      this.cartService.cart.cartCells.splice(index, 1);
      this.cartService.saveCart(this.cartService.cart).then(r => {
            this.cartService.cartLocalDbIsUpdated$.next(Math.random());
      });
    }
  }

  loadDataForForm () {
    this.email = this.cartService.cart.email;
    this.name = this.cartService.cart.name;
    this.phone = this.cartService.cart.phone;
    this.message = this.cartService.cart.message;
  }

  sendInterestDeclarationEmail() {
    // *** update cart
    this.cartService.cart.email = this.email;
    this.cartService.cart.message = this.message;
    this.cartService.cart.name = this.name;
    this.cartService.cart.phone = this.phone;
    this.cartService.cart.languageId = this.currentLanguageService.currentLanguage.languageId;
    this.cartService.cart.languageCode = this.currentLanguageService.currentLanguage.languageCode;

    this.cartService.cart.letterMessage =
      this.letterMessageBuilder(this.cartService.cart, this.currentLanguageService.currentLanguage.languageId);

    this.cartService.cart.isInterestLetterSent = true;
    this.cartService.saveCart(this.cartService.cart).then(r => {
      this.cartService.cartLocalDbIsUpdated$.next(Math.random());
    });

    this.loadDataForForm();
    this.startCountdown();
    // *** send email to the back with data
    this.sendNewOrder$ = this.orderService.sendNewOrder(this.cartService.cart).subscribe({
      next: value => {
      }
    })

  }


  letterMessageBuilder(cart: Cart, languageId: number) {

    let messageHeader = '';
    let messageFooter = '';
    let messageBody = '';

    for (let descriptor of this.uiBigElementForMessageHeader.descriptors) {
      if (descriptor.language.languageId === this.currentLanguageService.currentLanguage.languageId) {
        messageHeader = descriptor.value;
        break;
      }
    }

    for (let descriptor of this.uiBigElementForMessageFooter.descriptors) {
      if (descriptor.language.languageId === this.currentLanguageService.currentLanguage.languageId) {
        messageFooter = descriptor.value;
        break;
      }
    }

    // form the message body (a list of the products)

    messageBody = '<ul>\n';
    for (let cell of cart.cartCells) {
      for (let titleDescriptor of cell.product.titleDescriptors) {
        if (titleDescriptor.language.languageId === this.currentLanguageService.currentLanguage.languageId) {
          messageBody += '<li>' + titleDescriptor.value + '</li>\n';
          break;
        }
      }
    }
    messageBody += '</ul>\n';

    return '<!DOCTYPE html><html lang=\"en\"><body>' +
    messageHeader + '\n\n' + messageBody + '\n\n' + messageFooter +
      '</body></html>';
  }

  openToCorrectList() {
    this.cartService.cart.isInterestLetterSent = false;
    this.cartService.saveCart(this.cartService.cart).then(r => {
      this.cartService.cartLocalDbIsUpdated$.next(Math.random());
    });
  }

  clearList() {
    // mean clear cart
    this.cartService.cart.createdDate = new Date();
    this.cartService.cart.cartCells = [];
    this.cartService.cart.isInterestLetterSent = false;
    this.cartService.saveCart(this.cartService.cart).then(r => {
      this.cartService.cartLocalDbIsUpdated$.next(Math.random());
    });

    this.router.navigateByUrl("/product/explore").then(r => {});

  }

  returnToList() {

  }


}
