import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LanguageService } from '../../../services/language.service';
import { ArrangementsService, Arrangement } from '../../../services/arrangements.service';
import { AccountService } from '../../../services/account.service';

type SortKey = 'title-asc' | 'title-desc' | 'price-asc' | 'price-desc';

@Component({
  selector: 'app-arrangements-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="arr-page">
      <header class="arr-header">
        <div>
          <h1>{{ t('title') }}</h1>
          <p class="subtitle">{{ t('subtitle') }}</p>
        </div>
      </header>

      <div class="controls">
        <div class="group-tabs" role="tablist" [attr.aria-label]="t('groups')">
          @for (g of groups(); track g) {
            <button
              type="button"
              class="tab"
              [class.active]="g === selectedGroup()"
              (click)="selectedGroup.set(g); placeFilter.set(''); strictPlace.set(false)"
            >
              {{ groupLabel(g) }}
            </button>
          }
        </div>

        <div class="filters">
          <label class="field">
            <span>{{ t('place') }}</span>
            <input
              type="text"
              [placeholder]="t('placePlaceholder')"
              [value]="placeFilter()"
              (input)="placeFilter.set(($any($event.target).value || '').toString()); strictPlace.set(false)"
            />
          </label>

          <label class="field">
            <span>{{ t('search') }}</span>
            <input
              type="text"
              [placeholder]="t('searchPlaceholder')"
              [value]="query()"
              (input)="query.set(($any($event.target).value || '').toString())"
            />
          </label>

          <label class="field">
            <span>{{ t('sort') }}</span>
            <select [value]="sort()" (change)="sort.set($any($event.target).value)">
              <option value="title-asc">{{ t('sortTitleAsc') }}</option>
              <option value="title-desc">{{ t('sortTitleDesc') }}</option>
              <option value="price-asc">{{ t('sortPriceAsc') }}</option>
              <option value="price-desc">{{ t('sortPriceDesc') }}</option>
            </select>
          </label>

          <button type="button" class="btn btn--secondary btn--sm" (click)="clearFilters()">
            {{ t('clear') }}
          </button>
        </div>
      </div>

      <div class="list">
        @if (filtered().length === 0) {
          <p class="empty">{{ t('empty') }}</p>
        } @else {
          @for (a of filtered(); track a.id) {
            <article class="card">
              <img class="thumb" [src]="thumb(a)" [alt]="t('imgAlt')" loading="lazy" />

              <div class="content">
                <h2 class="title">{{ a.title }}</h2>
                <p class="meta">{{ placeLabel(a.place) }} • {{ groupLabel(a.group) }}</p>
                <p class="meta">{{ a.startDate }} - {{ a.endDate }}</p>

                <div class="bottom">
                  <div>
                    <p class="price">{{ a.price }} €</p>
                    <p class="rating">{{ t('avgRating') }}: {{ avgRating(a) }}/5</p>
                  </div>

                  <div class="actions">
                    <a class="btn btn--sm" [routerLink]="['/aranzmani', a.id]">{{ t('details') }}</a>
                    <button
                      type="button"
                      class="btn btn--sm btn--accent"
                      (click)="reserve(a)"
                      [disabled]="account.isReserved(a)"
                    >
                      {{ account.isReserved(a) ? t('reserved') : t('reserve') }}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          }
        }
      </div>
    </section>
  `,
  styles: [
    `
      .arr-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px 16px 40px;
        display: grid;
        gap: 16px;
      }

      .arr-header h1 {
        margin: 0 0 6px;
      }

      .subtitle {
        margin: 0;
        color: var(--color-text-secondary);
      }

      .controls {
        display: grid;
        gap: 12px;
        border: 1px solid var(--color-border);
        background: var(--color-bg-primary);
        border-radius: 12px;
        padding: 12px;
      }

      .group-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .tab {
        border: 1px solid var(--color-border-dark);
        background: var(--color-bg-primary);
        padding: 8px 12px;
        border-radius: 999px;
        cursor: pointer;
        font-weight: 700;
        color: var(--color-text-secondary);
      }

      .tab.active {
        background: var(--color-primary-dark);
        border-color: var(--color-primary-dark);
        color: var(--color-text-inverse);
      }

      .filters {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr auto;
        gap: 12px;
        align-items: end;
      }

      .field {
        display: grid;
        gap: 6px;
        font-weight: 600;
        color: var(--color-text-secondary);
      }

      input,
      select {
        border: 1px solid var(--color-border-dark);
        border-radius: 10px;
        padding: 10px 12px;
        font-family: var(--font-primary), sans-serif;
        font-weight: 600;
        background: var(--color-bg-primary);
        outline: none;
      }

      input:focus,
      select:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.12);
      }

      .list {
        display: grid;
        gap: 12px;
      }

      .card {
        display: grid;
        grid-template-columns: 260px 1fr;
        gap: 12px;
        border: 1px solid var(--color-border);
        border-radius: 12px;
        overflow: hidden;
        background: var(--color-bg-primary);
      }

      .thumb {
        width: 100%;
        height: 100%;
        min-height: 180px;
        object-fit: cover;
      }

      .content {
        padding: 12px;
        display: grid;
        gap: 6px;
      }

      .title {
        margin: 0;
        font-size: 20px;
      }

      .meta {
        margin: 0;
        color: var(--color-text-secondary);
      }

      .bottom {
        margin-top: 8px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }

      .price {
        margin: 0;
        font-weight: 800;
        font-size: 22px;
      }

      .rating {
        margin: 0;
        color: var(--color-text-muted);
      }

      .actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .empty {
        color: var(--color-text-muted);
        padding: 14px;
        border: 1px solid var(--color-border);
        border-radius: 12px;
        background: var(--color-bg-secondary);
      }

      @media (max-width: 1050px) {
        .filters {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 900px) {
        .card {
          grid-template-columns: 1fr;
        }

        .thumb {
          height: 220px;
        }
      }
    `
  ]
})
export class ArrangementsPageComponent {
  readonly lang = inject(LanguageService);
  private readonly arrangements = inject(ArrangementsService);
  readonly account = inject(AccountService);
  private readonly route = inject(ActivatedRoute);

  readonly groups = computed(() => this.arrangements.getGroups());
  readonly selectedGroup = signal<string>(this.arrangements.getGroups()[0] ?? '');

  readonly query = signal<string>('');
  readonly placeFilter = signal<string>('');
  readonly strictPlace = signal<boolean>(false);
  readonly sort = signal<SortKey>('title-asc');

  constructor() {
    // React to query params changes and set filters accordingly.
    this.route.queryParamMap.subscribe((qp) => {
      const group = qp.get('group');
      const place = qp.get('place');

      if (group && this.groups().includes(group)) {
        this.selectedGroup.set(group);
      }

      if (place) {
        this.placeFilter.set(place);
        this.strictPlace.set(true);
      } else {
        this.strictPlace.set(false);
      }
    });
  }

  private base = computed(() =>
    this.selectedGroup() ? this.arrangements.getByGroup(this.selectedGroup()) : this.arrangements.getAll()
  );

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const place = this.placeFilter().trim().toLowerCase();
    const sortKey = this.sort();

    let list = [...this.base()];

    if (place) {
      if (this.strictPlace()) {
        list = list.filter(a => a.place.toLowerCase() === place);
      } else {
        list = list.filter(a => a.place.toLowerCase().includes(place));
      }
    }

    if (q) {
      const qNum = Number(q);
      list = list.filter(a => {
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesPrice = !Number.isNaN(qNum) && a.price === qNum;
        return matchesTitle || matchesPrice;
      });
    }

    list.sort((a, b) => {
      switch (sortKey) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
      }
    });

    return list;
  });

  clearFilters(): void {
    this.query.set('');
    this.placeFilter.set('');
    this.strictPlace.set(false);
    this.sort.set('title-asc');
  }

  thumb(a: Arrangement): string {
    return this.arrangements.getImageUrl(a.images[0] ?? '');
  }

  avgRating(a: Arrangement): number {
    return this.account.getAverageRating(a);
  }

  reserve(a: Arrangement): void {
    this.account.reserve(a);
  }

  groupLabel(group: string): string {
    return this.arrangements.translateGroup(group, this.lang.currentLang());
  }

  placeLabel(place: string): string {
    return this.arrangements.translatePlace(place, this.lang.currentLang());
  }

  t(
    key:
      | 'title'
      | 'subtitle'
      | 'groups'
      | 'place'
      | 'placePlaceholder'
      | 'search'
      | 'searchPlaceholder'
      | 'sort'
      | 'sortTitleAsc'
      | 'sortTitleDesc'
      | 'sortPriceAsc'
      | 'sortPriceDesc'
      | 'clear'
      | 'details'
      | 'reserve'
      | 'reserved'
      | 'empty'
      | 'avgRating'
      | 'imgAlt'
  ): string {
    const isSr = this.lang.currentLang() === 'sr';
    const labels = {
      title: isSr ? 'Аранжмани' : 'Arrangements',
      subtitle: isSr
        ? 'Филтрирајте по дестинацији, претражујте по називу или цени и резервишите аранжман.'
        : 'Filter by destination, search by title or price, and reserve an arrangement.',
      groups: isSr ? 'Групе аранжмана' : 'Arrangement groups',
      place: isSr ? 'Дестинација' : 'Destination',
      placePlaceholder: isSr ? 'Нпр. Праг, Берлин' : 'e.g. Prague, Berlin',
      search: isSr ? 'Претрага' : 'Search',
      searchPlaceholder: isSr ? 'Назив или цена (нпр. 780)' : 'Title or price (e.g. 780)',
      sort: isSr ? 'Сортирање' : 'Sort',
      sortTitleAsc: isSr ? 'Назив A-Š' : 'Title A-Z',
      sortTitleDesc: isSr ? 'Назив Š-A' : 'Title Z-A',
      sortPriceAsc: isSr ? 'Цена растуће' : 'Price ascending',
      sortPriceDesc: isSr ? 'Цена опадајуће' : 'Price descending',
      clear: isSr ? 'Очисти' : 'Clear',
      details: isSr ? 'Детаљи' : 'Details',
      reserve: isSr ? 'Резервиши' : 'Reserve',
      reserved: isSr ? 'Резервисано' : 'Reserved',
      empty: isSr ? 'Нема резултата за изабране услове.' : 'No results for selected filters.',
      avgRating: isSr ? 'Просечна оцена' : 'Average rating',
      imgAlt: isSr ? 'Слика аранжмана' : 'Arrangement image'
    };
    return labels[key];
  }
}
