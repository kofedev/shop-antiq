import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";
import {ProductPage} from "../model/product-page";
import {Cart} from "../model/cart";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  public sendNewOrder(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.environment.baseUrl + "/order/common", cart);
  }

}
