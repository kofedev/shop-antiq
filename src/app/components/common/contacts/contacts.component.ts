import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiElementService} from "../../../services/ui-element.service";
import {CurrentLanguageService} from "../../../services/current-language.service";
import {UiBigElementService} from "../../../services/ui-big-element.service";
import {UiElementFull} from "../../../model/ui-element-full";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit, OnDestroy {

  constructor(public ui: UiElementService,
              public currLangService: CurrentLanguageService,
              private uiBigElementService: UiBigElementService) { }

  private readonly bigUiElementKey = 1;
  public uiBigElement!: UiElementFull;
  getUiBigElementsByKey$!: Subscription;

  ngOnDestroy() {
    if (this.getUiBigElementsByKey$) this.getUiBigElementsByKey$.unsubscribe();
  }

  ngOnInit() {
    this.getUiBigElementsByKey$ = this.uiBigElementService.getUiBigElementsByKey(this.bigUiElementKey).subscribe({
      next: value => {
        this.uiBigElement = value;
      }
    })
  }

}
