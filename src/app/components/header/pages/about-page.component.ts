import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../services/language.service';
import { ArrangementsService } from '../../../services/arrangements.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  template: `
    <section class="about-page">
      <header class="about-header">
        <h1>{{ t('title') }}</h1>
        <p>{{ t('intro') }}</p>
      </header>

      <section class="about-section">
        <h2>{{ t('whyTitle') }}</h2>
        <p>{{ t('whyText') }}</p>
      </section>

      <section class="about-section">
        <h2>{{ t('awardsTitle') }}</h2>
        <ul class="awards-list">
          <li>{{ t('award1') }}</li>
          <li>{{ t('award2') }}</li>
          <li>{{ t('award3') }}</li>
        </ul>
      </section>

      <section class="about-section">
        <h2>{{ t('galleryTitle') }}</h2>
        <div class="image-grid">
          @for (image of showcaseImages; track image) {
            <img [src]="image" [alt]="t('galleryAlt')" loading="lazy" />
          }
        </div>
      </section>

      <section class="about-section contact-layout">
        <div>
          <h2>{{ t('contactTitle') }}</h2>
          <p>{{ t('address') }}</p>
          <p>
            <strong>{{ t('phoneLabel') }}</strong>
            <a class="phone-link" href="tel:+381112001337">+381 11 200 1337</a>
          </p>
        </div>

        <div class="map-wrap">
          <iframe
            title="ETF Belgrade map"
            src="https://www.google.com/maps?q=Bulevar%20kralja%20Aleksandra%2073%2C%20Beograd&z=16&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      .about-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px 16px 40px;
        display: grid;
        gap: 18px;
      }

      .about-header h1,
      .about-section h2 {
        margin: 0 0 8px;
      }

      .about-header p,
      .about-section p {
        margin: 0;
        color: var(--color-text-secondary);
        line-height: 1.5;
      }

      .about-section {
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: 16px;
        background: var(--color-bg-primary);
      }

      .awards-list {
        margin: 8px 0 0;
        padding-left: 18px;
        color: var(--color-text-secondary);
      }

      .image-grid {
        margin-top: 10px;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .image-grid img {
        width: 100%;
        height: 220px;
        object-fit: cover;
        border-radius: 10px;
      }

      .contact-layout {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 16px;
        align-items: stretch;
      }

      .phone-link {
        margin-left: 8px;
        color: var(--color-primary-dark);
        text-decoration: none;
        font-weight: 600;
      }

      .phone-link:hover {
        text-decoration: underline;
      }

      .map-wrap iframe {
        border: 0;
        width: 100%;
        min-height: 300px;
        border-radius: 10px;
      }

      @media (max-width: 1000px) {
        .image-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .contact-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .image-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AboutPageComponent {
  lang = inject(LanguageService);
  private arrangementsService = inject(ArrangementsService);

  showcaseImages = this.arrangementsService.getAllImages().slice(0, 6);

  t(
    key:
      | 'title'
      | 'intro'
      | 'whyTitle'
      | 'whyText'
      | 'awardsTitle'
      | 'award1'
      | 'award2'
      | 'award3'
      | 'galleryTitle'
      | 'galleryAlt'
      | 'contactTitle'
      | 'address'
      | 'phoneLabel'
  ): string {
    const isSr = this.lang.currentLang() === 'sr';

    const labels = {
      title: isSr ? 'О нама' : 'About Us',
      intro: isSr
        ? 'Туристичка агенција је усмерена на сигурна путовања, брзу онлајн резервацију и персонализоване препоруке за сваког путника.'
        : 'Our travel agency is focused on safe trips, fast online booking, and personalized recommendations for every traveler.',
      whyTitle: isSr ? 'Зашто смо другачији' : 'Why We Are Different',
      whyText: isSr
        ? 'Комбинујемо локално искуство, проверене партнере и транспарентне цене. Подршка је доступна пре, током и након путовања, а корисник увек има јасан преглед статуса резервације.'
        : 'We combine local expertise, verified partners, and transparent pricing. Support is available before, during, and after each trip, with clear booking status at all times.',
      awardsTitle: isSr ? 'Награде и признања' : 'Awards and Recognition',
      award1: isSr ? 'Најбоља корисничка подршка у региону (Travel UX Awards 2024).' : 'Best Customer Support in the Region (Travel UX Awards 2024).',
      award2: isSr ? 'Признање за иновативни веб дизајн туристичких платформи.' : 'Recognition for innovative web design in travel platforms.',
      award3: isSr ? 'Партнер године за одрживи туризам.' : 'Partner of the Year for sustainable tourism.',
      galleryTitle: isSr ? 'Део наше понуде' : 'Part of Our Offer',
      galleryAlt: isSr ? 'Слика из понуде аранжмана' : 'Arrangement offer image',
      contactTitle: isSr ? 'Контакт и локација' : 'Contact and Location',
      address: isSr ? 'Булевар краља Александра 73, Београд' : 'Bulevar kralja Aleksandra 73, Belgrade',
      phoneLabel: isSr ? 'Телефон:' : 'Phone:'
    };

    return labels[key];
  }
}
