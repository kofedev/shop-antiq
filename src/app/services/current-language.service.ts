import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {EnvironmentService} from "./environment.service";
import {Language} from "../model/language.model";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrentLanguageService {

  constructor(private http: HttpClient, private environment: EnvironmentService) {
  }

  public activeLanguageArray: Language[] = [];
  public currentLanguage!: Language;
  public languageIsSelected$ = new Subject<number>();

  public getAllActiveLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.environment.baseUrl + "/language/common/active");
  }

}
