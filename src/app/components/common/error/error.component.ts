import { Component } from '@angular/core';
import {UiElementService} from "../../../services/ui-element.service";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {
  constructor(public ui: UiElementService) {}
}
