import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";
import {Category} from "../model/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  public _global_root_category_id!: number;
  public _global_current_category_id!: number;

  public getRootCategory(): Observable<Category> {
    return this.http.get<Category>(this.environment.baseUrl + "/category/common/root");
  }

  public getCategoryById(categoryId: number): Observable<Category> {
    return this.http.get<Category>(this.environment.baseUrl + "/category/common/" + categoryId);
  }

}
