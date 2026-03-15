import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ArrangementsService } from '../../../services/arrangements.service';

type TopDestination = {
  group: string;
  place: string;
  image: string;
};

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="home">
      <header class="hero">
        <div>
          <h1>{{ t('title') }}</h1>
          <p class="lead">{{ t('lead') }}</p>

          <div class="hero-actions">
            <a class="btn btn--accent" routerLink="/aranzmani">{{ t('browse') }}</a>
            <a class="btn btn--secondary" routerLink="/o-nama">{{ t('about') }}</a>
          </div>
        </div>
      </header>

      <section class="section">
        <h2>{{ t('newsTitle') }}</h2>
        <div class="grid">
          @for (n of news(); track n.title) {
            <article class="card">
              <h3>{{ n.title }}</h3>
              <p>{{ n.text }}</p>
            </article>
          }
        </div>
      </section>

      <section class="section">
        <h2>{{ t('topDestTitle') }}</h2>
        <p class="hint">{{ t('topDestHint') }}</p>

        <div class="dest-grid">
          @for (d of topDestinations(); track d.place) {
            <a
              class="dest-card"
              [routerLink]="['/aranzmani']"
              [queryParams]="{ group: d.group, place: d.place }"
            >
              <img [src]="d.image" [alt]="d.place" loading="lazy" />
              <div class="overlay">
                <h3>{{ placeLabel(d.place) }}</h3>
                <p>{{ groupLabel(d.group) }}</p>
              </div>
            </a>
          }
        </div>
      </section>

      <section class="section">
        <h2>{{ t('bannersTitle') }}</h2>
        <div class="banners">
          <a class="banner" href="https://www.yuta.rs/" target="_blank" rel="noreferrer">YUTA</a>
          <a class="banner" href="https://www.unwto.org/" target="_blank" rel="noreferrer">UN Tourism</a>
          <a class="banner" href="https://www.etf.bg.ac.rs/" target="_blank" rel="noreferrer">ETF</a>
        </div>
      </section>
    </section>
  `,
  styles: [
    `
      .home {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px 16px 40px;
        display: grid;
        gap: 18px;
      }

      .hero {
        border: 1px solid var(--color-border);
        border-radius: 16px;
        padding: 18px;
        background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-primary));
      }

      .hero h1 {
        margin: 0 0 8px;
      }

      .lead {
        margin: 0;
        color: var(--color-text-secondary);
        line-height: 1.5;
        max-width: 70ch;
      }

      .hero-actions {
        margin-top: 14px;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .section {
        border: 1px solid var(--color-border);
        border-radius: 16px;
        padding: 16px;
        background: var(--color-bg-primary);
      }

      .section h2 {
        margin: 0 0 12px;
      }

      .hint {
        margin: -4px 0 12px;
        color: var(--color-text-muted);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .card {
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: 12px;
        background: var(--color-bg-secondary);
      }

      .card h3 {
        margin: 0 0 8px;
      }

      .card p {
        margin: 0;
        color: var(--color-text-secondary);
        line-height: 1.5;
      }

      .dest-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .dest-card {
        position: relative;
        border: 1px solid var(--color-border);
        border-radius: 12px;
        overflow: hidden;
        display: block;
        text-decoration: none;
        color: inherit;
        background: var(--color-bg-secondary);
      }

      .dest-card img {
        width: 100%;
        height: 210px;
        object-fit: cover;
        filter: saturate(1.05);
        transition: transform 300ms ease;
      }

      .dest-card:hover img {
        transform: scale(1.05);
      }

      .overlay {
        position: absolute;
        inset: auto 0 0 0;
        padding: 12px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.72));
        color: #fff;
      }

      .overlay h3 {
        margin: 0;
      }

      .overlay p {
        margin: 4px 0 0;
        opacity: 0.92;
        font-weight: 600;
      }

      .banners {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .banner {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 72px;
        border-radius: 12px;
        border: 1px solid var(--color-border-dark);
        background: var(--color-bg-secondary);
        text-decoration: none;
        font-weight: 800;
        color: var(--color-primary-dark);
      }

      .banner:hover {
        background: var(--color-bg-accent);
        border-color: var(--color-accent);
        color: var(--color-accent-dark);
      }

      @media (max-width: 1000px) {
        .grid,
        .dest-grid,
        .banners {
          grid-template-columns: 1fr;
        }

        .dest-card img {
          height: 240px;
        }
      }
    `
  ]
})
export class HomePageComponent {
  readonly lang = inject(LanguageService);
  private readonly arrangements = inject(ArrangementsService);

  news = computed(() => {
    const isSr = this.lang.currentLang() === 'sr';
    return [
      {
        title: isSr ? 'Понуда која ускоро почиње' : 'Trips starting soon',
        text: isSr
          ? 'Пратите аранжмане који почињу у наредним недељама и резервишите на време.'
          : 'Check trips starting in the coming weeks and book in time.'
      },
      {
        title: isSr ? 'Нови чланови тима' : 'New team members',
        text: isSr
          ? 'Наш тим је појачан новим саветницима за путовања и подршку 24/7.'
          : 'We expanded our team with new travel advisors and 24/7 support.'
      },
      {
        title: isSr ? 'Попусти за ране резервације' : 'Early booking discounts',
        text: isSr
          ? 'Остварите попуст на одабране летње и зимске аранжмане.'
          : 'Get discounts on selected summer and winter arrangements.'
      }
    ];
  });

  topDestinations = computed<TopDestination[]>(() => {
    const pick = (place: string, group: string): TopDestination => {
      const arr = this.arrangements.getAll().find(a => a.place === place && a.group === group);
      const image = arr ? this.arrangements.getImageUrl(arr.images[0] ?? '') : '';
      return { place, group, image };
    };

    return [
      pick('Pariz', 'Evropa'),
      pick('London', 'Evropa'),
      pick('Santorini', 'Leto 2025'),
      pick('Amalfi', 'Leto 2025'),
      pick('Kopaonik', 'Zima 2025'),
      pick('Zermatt', 'Zima 2025')
    ].filter(d => !!d.image);
  });

  t(
    key:
      | 'title'
      | 'lead'
      | 'browse'
      | 'about'
      | 'newsTitle'
      | 'topDestTitle'
      | 'topDestHint'
      | 'bannersTitle'
  ): string {
    const isSr = this.lang.currentLang() === 'sr';
    const labels = {
      title: isSr ? 'Туристичка агенција' : 'Travel Agency',
      lead: isSr
        ? 'Одаберите дестинацију, погледајте понуде и резервишите онлајн. Увек имате преглед резервација у Мој налог.'
        : 'Pick a destination, browse offers, and book online. You always have an overview in My Account.',
      browse: isSr ? 'Погледај аранжмане' : 'Browse arrangements',
      about: isSr ? 'О нама' : 'About us',
      newsTitle: isSr ? 'Актуелности' : 'News',
      topDestTitle: isSr ? 'Топ дестинације' : 'Top destinations',
      topDestHint: isSr
        ? 'Кликните на дестинацију да одмах видите филтриране аранжмане.'
        : 'Click a destination to instantly see filtered arrangements.',
      bannersTitle: isSr ? 'Партнерски линкови' : 'Partner links'
    };

    return labels[key];
  }

  groupLabel(group: string): string {
    return this.arrangements.translateGroup(group, this.lang.currentLang());
  }

  placeLabel(place: string): string {
    return this.arrangements.translatePlace(place, this.lang.currentLang());
  }
}
