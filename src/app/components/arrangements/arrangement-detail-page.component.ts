import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArrangementsService } from '../../services/arrangements.service';
import { AccountService } from '../../services/account.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-arrangement-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="detail-page">
      <a class="back-link" routerLink="/aranzmani">← {{ t('back') }}</a>

      @if (!arrangement()) {
        <p class="empty">{{ t('notFound') }}</p>
      } @else {
        <header class="header">
          <div>
            <h1>{{ arrangement()!.title }}</h1>
            <p class="meta">{{ placeLabel(arrangement()!.place) }} • {{ groupLabel(arrangement()!.group) }}</p>
            <p class="meta">{{ arrangement()!.startDate }} - {{ arrangement()!.endDate }}</p>
          </div>

          <div class="price-box">
            <p class="price">{{ arrangement()!.price }} €</p>
            <p class="rating">{{ t('avgRating') }}: {{ avgRating() }}/5</p>

            <button
              type="button"
              class="btn btn--accent"
              (click)="reserve()"
              [disabled]="isReserved()"
            >
              {{ isReserved() ? t('reserved') : t('reserve') }}
            </button>

            @if (reserveMessage()) {
              <p class="reserve-message">{{ reserveMessage() }}</p>
            }
          </div>
        </header>

        <div class="image-grid">
          @for (img of images(); track img) {
            <img [src]="img" [alt]="t('imgAlt')" loading="lazy" />
          }
        </div>

        <section class="info">
          <h2>{{ t('infoTitle') }}</h2>
          <ul>
            <li>{{ t('info1') }}</li>
            <li>{{ t('info2') }}</li>
            <li>{{ t('info3') }}</li>
          </ul>
        </section>
      }
    </section>
  `,
  styles: [
    `
      .detail-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px 16px 40px;
        display: grid;
        gap: 16px;
      }

      .back-link {
        color: var(--color-primary-dark);
        text-decoration: none;
        font-weight: 600;
        width: fit-content;
      }

      .back-link:hover {
        text-decoration: underline;
      }

      .header {
        display: grid;
        grid-template-columns: 1.5fr 0.9fr;
        gap: 16px;
        align-items: start;
        border: 1px solid var(--color-border);
        border-radius: 12px;
        background: var(--color-bg-primary);
        padding: 16px;
      }

      h1 {
        margin: 0 0 6px;
      }

      .meta {
        margin: 4px 0;
        color: var(--color-text-secondary);
      }

      .price-box {
        border-left: 1px solid var(--color-border);
        padding-left: 16px;
        display: grid;
        gap: 10px;
      }

      .price {
        margin: 0;
        font-size: 28px;
        font-weight: 800;
      }

      .rating {
        margin: 0;
        color: var(--color-text-secondary);
      }

      .reserve-message {
        margin: 0;
        color: var(--color-text-muted);
        font-size: 0.95em;
      }

      .image-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
      }

      .image-grid img {
        width: 100%;
        height: 240px;
        object-fit: cover;
        border-radius: 12px;
        border: 1px solid var(--color-border);
      }

      .info {
        border: 1px solid var(--color-border);
        border-radius: 12px;
        background: var(--color-bg-primary);
        padding: 16px;
      }

      .info h2 {
        margin: 0 0 10px;
      }

      .info ul {
        margin: 0;
        padding-left: 18px;
        color: var(--color-text-secondary);
        line-height: 1.6;
      }

      .empty {
        color: var(--color-text-muted);
        padding: 14px;
        border: 1px solid var(--color-border);
        border-radius: 12px;
        background: var(--color-bg-secondary);
      }

      @media (max-width: 900px) {
        .header {
          grid-template-columns: 1fr;
        }

        .price-box {
          border-left: none;
          padding-left: 0;
          border-top: 1px solid var(--color-border);
          padding-top: 12px;
        }

        .image-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 600px) {
        .image-grid {
          grid-template-columns: 1fr;
        }

        .image-grid img {
          height: 220px;
        }
      }
    `
  ]
})
export class ArrangementDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly arrangements = inject(ArrangementsService);
  private readonly account = inject(AccountService);
  readonly lang = inject(LanguageService);

  private readonly id = computed(() => this.route.snapshot.paramMap.get('id'));

  readonly arrangement = computed(() => {
    const id = this.id();
    if (!id) return null;
    return this.arrangements.getById(id);
  });

  readonly images = computed(() => {
    const arr = this.arrangement();
    if (!arr) return [];
    return this.arrangements.getImages(arr);
  });

  readonly avgRating = computed(() => {
    const arr = this.arrangement();
    if (!arr) return 0;
    return this.account.getAverageRating(arr);
  });

  readonly isReserved = computed(() => {
    const arr = this.arrangement();
    if (!arr) return false;
    return this.account.isReserved(arr);
  });

  reserveMessage = computed(() => {
    const arr = this.arrangement();
    if (!arr) return '';
    if (this.isReserved()) {
      return this.t('alreadyReservedHint');
    }
    return '';
  });

  reserve(): void {
    const arr = this.arrangement();
    if (!arr) return;
    this.account.reserve(arr);
  }

  groupLabel(group: string): string {
    return this.arrangements.translateGroup(group, this.lang.currentLang());
  }

  placeLabel(place: string): string {
    return this.arrangements.translatePlace(place, this.lang.currentLang());
  }

  t(
    key:
      | 'back'
      | 'notFound'
      | 'reserve'
      | 'reserved'
      | 'alreadyReservedHint'
      | 'avgRating'
      | 'imgAlt'
      | 'infoTitle'
      | 'info1'
      | 'info2'
      | 'info3'
  ): string {
    const isSr = this.lang.currentLang() === 'sr';
    const labels = {
      back: isSr ? 'Назад на аранжмане' : 'Back to arrangements',
      notFound: isSr ? 'Аранжман није пронађен.' : 'Arrangement not found.',
      reserve: isSr ? 'Резервиши' : 'Reserve',
      reserved: isSr ? 'Резервисано' : 'Reserved',
      alreadyReservedHint: isSr ? 'Овај аранжман је већ у вашим резервацијама.' : 'This arrangement is already in your reservations.',
      avgRating: isSr ? 'Просечна оцена' : 'Average rating',
      imgAlt: isSr ? 'Слика аранжмана' : 'Arrangement image',
      infoTitle: isSr ? 'Информације' : 'Info',
      info1: isSr ? 'У цену су укључени смештај и организација путовања.' : 'The price includes accommodation and trip organization.',
      info2: isSr ? 'Могућа је онлајн резервација и праћење статуса у Мој налог.' : 'Online booking is available, with status in My Account.',
      info3: isSr ? 'За сва питања, контакт је доступан сваког дана.' : 'For any questions, support is available every day.'
    };
    return labels[key];
  }
}
