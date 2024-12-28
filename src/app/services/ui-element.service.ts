import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UiElementService {

  constructor(private http: HttpClient, private environment: EnvironmentService) { }

  uiElements: string[] = [];

  public getUiShortElementsByLanguage_Ultra(languageId: number): Observable<string[]> {
    return this.http.get<string[]>(this.environment.baseUrl + "/uishort/common/" + languageId);
  }

}
