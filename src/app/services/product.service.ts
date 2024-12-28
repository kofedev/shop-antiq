import { Injectable } from '@angular/core';
import {EnvironmentService} from "./environment.service";
import {HttpClient} from "@angular/common/http";
import {Product} from "../model/product";
import {Observable} from "rxjs";
import {ProductPage} from "../model/product-page";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  public searchString = '';

  public getProductsByParameters(queryStringTail: string): Observable<ProductPage> {
    /// console.log("QUERY: " + "/product/common" + queryStringTail); ///
    return this.http.get<ProductPage>(this.environment.baseUrl + "/product/common" + queryStringTail);
  }

  public getProductById_full(productId: number): Observable<Product> {
    return this.http.get<Product>(this.environment.baseUrl + "/product/common/full/" + productId);
  }

}
