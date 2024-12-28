import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoryService} from "./services/category.service";
import {Category} from "./model/category";
import {Subscription} from "rxjs";
import {CurrentLanguageService} from "./services/current-language.service";
import {EnvironmentService} from "./services/environment.service";
import {UiElementService} from "./services/ui-element.service";
import {CartService} from "./services/cart.service";
import {Router} from "@angular/router";
import {ProductService} from "./services/product.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  _ready = false;
  root!: Category;
  getRootCategory$!: Subscription;
  getAllActiveLanguages$!: Subscription;
  getUiShortElementsByLanguage_Ultra$!: Subscription;

  constructor(private categoryService: CategoryService,
              public currentLanguageService: CurrentLanguageService,
              public environment: EnvironmentService,
              private cartService: CartService,
              public uiElementService: UiElementService,
              public productService: ProductService) { }

  ngOnDestroy() {
    if (this.getRootCategory$) this.getRootCategory$.unsubscribe();
    if (this.getAllActiveLanguages$) this.getAllActiveLanguages$.unsubscribe();
    if (this.getUiShortElementsByLanguage_Ultra$) this.getUiShortElementsByLanguage_Ultra$.unsubscribe();
  }

  ngOnInit(): void {
    this.init();
  }

  init () {
    this.getRootCategory$ = this.categoryService.getRootCategory().subscribe({
      next: value => {
        this.root = structuredClone(value);
        this.categoryService._global_root_category_id = this.root.categoryId;
        // *** go to the next step
        this.initLanguageSystem();
        },
      error: err => { console.error('There is trouble with getting the root category'); }
    })
  }

  initLanguageSystem() {
    this.getAllActiveLanguages$ = this.currentLanguageService.getAllActiveLanguages().subscribe({
      next: value => {
        this.currentLanguageService.activeLanguageArray = structuredClone(value);
        // *** set current language as a system default language
        const defaultLanguage = value.find(language => language.byDefault);
        if (defaultLanguage) {
          this.currentLanguageService.currentLanguage = defaultLanguage;
        } else { console.error("System current language not found"); }
        // *** attempt: set user's current language
        const user_defaultLanguageId: number | null = Number(localStorage.getItem(this.environment.localStorageKeyCurrentLanguage));
        if (user_defaultLanguageId) {
          const user_defaultLanguage = value.find(language => language.languageId === user_defaultLanguageId);
          if (user_defaultLanguage) { this.currentLanguageService.currentLanguage = user_defaultLanguage; }
        } else {
          localStorage.setItem(this.environment.localStorageKeyCurrentLanguage, String(this.currentLanguageService.currentLanguage.languageId));
        }

        // *** LOAD UI SHORTS ELEMENTS BY LANGUAGE AND LOAD LOCAL BUFFER
        this.getUiShortElementsByLanguage_Ultra$ = this.uiElementService.getUiShortElementsByLanguage_Ultra(this.currentLanguageService.currentLanguage.languageId).subscribe({
          next: value => {
            this.uiElementService.uiElements = structuredClone(value);
            // **** NEXT STEP ****
            this.loadCart();
          }
        });
      }
    })
  }

  loadCart() {
    this.cartService.loadCart().then(value => {
      if (value !== undefined) {
        this.cartService.cart = structuredClone(value);

        // **********************
        // *** READY TO START ***
        // **********************
        this._ready = true;

      } else {
        console.log("Error on cart loading"); /////// POINT OF THE PROBLEM AFTER DELETE DB BY HAND
      }
    });
  }

  labDone () {
    console.log('FOCUS')
  }

}
