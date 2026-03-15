import { Component, inject } from '@angular/core';
import { ArrangementsService } from '../../services/arrangements.service';
import { LanguageService } from '../../services/language.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

type GalleryVideo = {
  titleSr: string;
  titleEn: string;
  url: SafeResourceUrl;
};

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  private readonly arrangementsService = inject(ArrangementsService);
  readonly lang = inject(LanguageService);
  private readonly sanitizer = inject(DomSanitizer);

  allImages: string[] = this.arrangementsService.getAllImages();

  videos: GalleryVideo[] = [
    {
      titleSr: 'Промо видео: лето 2025',
      titleEn: 'Promo video: Summer 2025',
      url: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/Scxs7L0vhZ4')
    },
    {
      titleSr: 'Промо видео: Европа',
      titleEn: 'Promo video: Europe',
      url: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/KO7JHH916Zk')
    }
  ];

  t(key: 'title' | 'videoTitle' | 'imagesTitle'): string {
    const isSr = this.lang.currentLang() === 'sr';
    const labels = {
      title: isSr ? 'Галерија' : 'Gallery',
      videoTitle: isSr ? 'Видео галерија' : 'Video gallery',
      imagesTitle: isSr ? 'Галерија слика аранжмана' : 'Arrangement image gallery'
    };
    return labels[key];
  }

  videoLabel(video: { titleSr: string; titleEn: string }): string {
    return this.lang.currentLang() === 'sr' ? video.titleSr : video.titleEn;
  }
}
