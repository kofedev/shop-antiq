import {Component, Input, OnInit} from '@angular/core';
import {EnvironmentService} from "../../../services/environment.service";
import {Image} from "../../../model/image";

@Component({
  selector: 'app-image-small',
  templateUrl: './image-small.component.html',
  styleUrl: './image-small.component.scss'
})
export class ImageSmallComponent implements OnInit {
  @Input() images!: Image[];
  displayWidth = 1000;
  ngOnInit() {
    this.displayWidth = window.innerWidth;
  }
}
