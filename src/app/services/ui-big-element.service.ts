import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";
import {UiElementFull} from "../model/ui-element-full";
import {UiElement2} from "../model/ui-element-2";

@Injectable({
  providedIn: 'root'
})
export class UiBigElementService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  public getUiBigElementsByKey(key: number): Observable<UiElementFull> {
    return this.http.get<UiElementFull>(this.environment.baseUrl + "/uibig/common/" + key);
  }

  public getTwoUiBigElementsByKey(key1: number, key2: number): Observable<UiElement2> {
    return this.http.get<UiElement2>(this.environment.baseUrl + '/uibig/common/two/' + key1 + '/' + key2);
  }

}
