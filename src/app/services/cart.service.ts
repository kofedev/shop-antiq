import { Injectable } from '@angular/core';
import {Cart} from "../model/cart";
import {CartData} from "../model/cart-data";
import {LocalDatabaseService} from "./local-database.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private localDBService: LocalDatabaseService) {
    let index = this.getCartTableIndexFromLocalStorage();
    if (index != undefined) {
      //console.log("LOCAL STORAGE TABLE ID: " + index);
    } else {
      //console.log("THERE IS NO LOCAL STORAGE TABLE ID: ");
    }
  }

  public cart!: Cart;
  public cartLocalDbIsUpdated$ = new Subject<number>();
  private LOCAL_STORAGE_CART_EXISTING_KEY = "crt";

  private setCartTableIndexFromLocalStorage(index: number) {
    localStorage.setItem(this.LOCAL_STORAGE_CART_EXISTING_KEY, String(index));
  }

  private getCartTableIndexFromLocalStorage(): number | undefined {
    let index: string | null;
    index = localStorage.getItem(this.LOCAL_STORAGE_CART_EXISTING_KEY);
    if (index) return Number(index);
    else return undefined;
  }

  public async loadCart(): Promise<Cart | undefined> {
    let index = this.getCartTableIndexFromLocalStorage();
    if (index == undefined) {
      // create and save a new cart
      //console.log("INDEX IS undefined, going to create");
      let cart = {
        cartCells:  [],
        email: '',
        name: '',
        phone: '',
        message: '',
        isInterestLetterSent: false,
        lastVisit: new Date(),
        createdDate: new Date()
      };
      await this.saveCart(cart);
      return cart;
    } else {
      // load cartData (wrapper for cart) from DB and return the cart
      //console.log("INDEX IS:" + index);
      if (index != undefined) {
        try {
          let cartData = await this.localDBService.getCartDataById(index);
          if (cartData) {
            // console.log("Going to RETURN cart: " + cartData.cart.email);
            return cartData.cart;
          } else {
            // but index is exist. Version: the DB has been deleted
            // so try to create cart
            let cart = {
              cartCells:  [],
              email: '',
              name: '',
              phone: '',
              message: '',
              isInterestLetterSent: false,
              lastVisit: new Date(),
              createdDate: new Date()
            };
            await this.saveCart(cart);
            return cart;

          }
        } catch (error) {
          console.error('Error retrieving CartData:', error);
        }
      }
    }

    return undefined;
  }

  public saveCart(cart: Cart): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let index = this.getCartTableIndexFromLocalStorage();
      if (index == undefined) {
        // creating the table and define the index
        const cartData: CartData = {
          cart: cart
        };
        this.localDBService.addData(cartData)
          .then((id) => {
            this.setCartTableIndexFromLocalStorage(id);
            resolve();
          })
          .catch((error) => {
            console.error('Error adding data:', error);
            reject(error);
          });
      } else {
        // just save
        const cartData: CartData = {
          id: index,
          cart: cart
        };
        this.localDBService.addCartDataById(index, cartData)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error('Error adding data:', error);
            reject(error);
          });
      }
    });
  }
}
