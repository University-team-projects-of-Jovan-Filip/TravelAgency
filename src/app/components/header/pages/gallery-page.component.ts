import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  template: `
    <section>
      <h1>{{ lang.currentLang() === 'sr' ? 'Галерија' : 'Gallery' }}</h1>
    </section>
  `
})
export class GalleryPageComponent {
  lang = inject(LanguageService);
}
