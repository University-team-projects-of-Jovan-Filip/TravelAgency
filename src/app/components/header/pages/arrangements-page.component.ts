import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-arrangements-page',
  standalone: true,
  template: `
    <section>
      <h1>{{ lang.currentLang() === 'sr' ? 'Аранжмани' : 'Arrangements' }}</h1>
    </section>
  `
})
export class ArrangementsPageComponent {
  lang = inject(LanguageService);
}
