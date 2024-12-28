import {Component, OnDestroy} from '@angular/core';
import {CurrentLanguageService} from "../../../services/current-language.service";
import {EnvironmentService} from "../../../services/environment.service";
import {Subscription} from "rxjs";
import {Language} from "../../../model/language.model";
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent implements OnDestroy {

  constructor(public currentLanguageService: CurrentLanguageService,
              private environment: EnvironmentService,
              public ui: UiElementService) {
  }

  getUiShortElementsByLanguage_Ultra$!: Subscription;

  ngOnDestroy() {
    if (this.getUiShortElementsByLanguage_Ultra$) this.getUiShortElementsByLanguage_Ultra$.unsubscribe();
  }

  languageSelect(language: Language) {
    if (this.currentLanguageService.currentLanguage.languageId === language.languageId) return;
    this.currentLanguageService.currentLanguage = structuredClone(language);
    localStorage.setItem(this.environment.localStorageKeyCurrentLanguage, String(this.currentLanguageService.currentLanguage.languageId));

    this.getUiShortElementsByLanguage_Ultra$ = this.ui.getUiShortElementsByLanguage_Ultra(this.currentLanguageService.currentLanguage.languageId).subscribe({
      next: value => {
        this.ui.uiElements = value;
        this.currentLanguageService.languageIsSelected$.next(language.languageId);
        console.log("Current language: " + this.currentLanguageService.currentLanguage.languageCode);
      }
    });

  }

}

