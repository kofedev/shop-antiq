import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Observable} from "rxjs";
import {Language} from "../model/language.model";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private http: HttpClient, private environment: EnvironmentService) {
  }

  public getAllActiveLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.environment.baseUrl + "/language/common/active");
  }

}
