import {Component, Input, OnInit } from '@angular/core';

import {Image} from "../../../model/image";

@Component({
  selector: 'app-image-group',
  templateUrl: './image-group.component.html',
  styleUrl: './image-group.component.scss'
})
export class ImageGroupComponent implements OnInit{

  @Input() images!: Image[];
  _imageUrlGoTOModal: string = '';
  focusedImage!: Image;


  ngOnInit() {
    for (let image of this.images) {
      // if (image.mainImage) image.focused = true;
      if (image.mainImage) {
       this.focusedImage = image;
       break;
      }
    }
  }

  openModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }

  }

  closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

}
