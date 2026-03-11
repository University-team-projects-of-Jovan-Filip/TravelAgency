import { Component } from '@angular/core';
import { ArrangementsService } from '../../services/arrangements.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  allImages: string[];

  constructor(private arrangementsService: ArrangementsService) {
    this.allImages = this.arrangementsService.getAllImages();
  }

}
