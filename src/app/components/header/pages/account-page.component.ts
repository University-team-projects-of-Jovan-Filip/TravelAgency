import { Component, OnInit } from '@angular/core';
import { Arrangement } from '../../../services/arrangements.service';
import { AccountService } from '../../../services/account.service';
import { LanguageService } from '../../../services/language.service';

interface VisitedItem {
  arrangement: Arrangement;
  rating: number | null;
}

@Component({
  selector: 'app-account-page',
  standalone: true,
  template: `
    <section class="account-page">
      <h1>{{ t('title') }}</h1>

      <div class="account-grid">
        <article class="account-card">
          <h2>{{ t('reserved') }}</h2>

          @if (reservedArrangements.length === 0) {
            <p class="empty-state">{{ t('noReserved') }}</p>
          } @else {
            @for (arrangement of reservedArrangements; track trackByArrangement($index, arrangement)) {
              <div class="arrangement-item">
                <h3>{{ arrangement.title }}</h3>
                <p>{{ arrangement.place }} • {{ arrangement.group }}</p>
                <p>{{ arrangement.startDate }} — {{ arrangement.endDate }}</p>
                <p>{{ arrangement.price }} €</p>

                @if (canCancel(arrangement)) {
                  <button class="btn btn--sm" (click)="cancelReservation(arrangement)">{{ t('cancel') }}</button>
                } @else {
                  <p class="hint">{{ t('cancelHint') }}</p>
                }
              </div>
            }
          }
        </article>

        <article class="account-card">
          <h2>{{ t('visited') }}</h2>

          @if (visitedDestinations.length === 0) {
            <p class="empty-state">{{ t('noVisited') }}</p>
          } @else {
            @for (visited of visitedDestinations; track trackByArrangement($index, visited.arrangement)) {
              <div class="arrangement-item">
                <h3>{{ visited.arrangement.title }}</h3>
                <p>{{ visited.arrangement.place }} • {{ visited.arrangement.group }}</p>
                <p>{{ t('rating') }}</p>
                <div class="rating-row">
                  @for (star of stars; track star) {
                    <button
                      type="button"
                      class="rating-btn"
                      [class.active]="(visited.rating ?? 0) >= star"
                      (click)="setRating(visited.arrangement, star)"
                    >
                      ★
                    </button>
                  }
                </div>
              </div>
            }
          }
        </article>
      </div>
    </section>
  `,
  styles: [
    `
      .account-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px 16px;
      }

      .account-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .account-card {
        border: 1px solid var(--color-border);
        border-radius: 12px;
        background-color: var(--color-bg-primary);
        padding: 16px;
      }

      .arrangement-item {
        border-top: 1px solid var(--color-gray-light);
        padding: 12px 0;
      }

      .arrangement-item:first-of-type {
        border-top: none;
        padding-top: 0;
      }

      .arrangement-item h3 {
        margin: 0 0 8px;
      }

      .arrangement-item p {
        margin: 4px 0;
        color: var(--color-text-secondary);
      }

      .empty-state,
      .hint {
        color: var(--color-text-muted);
      }

      .rating-row {
        display: flex;
        gap: 6px;
      }

      .rating-btn {
        border: 1px solid var(--color-border-dark);
        border-radius: 6px;
        background: var(--color-bg-primary);
        color: var(--color-text-muted);
        cursor: pointer;
        padding: 6px 8px;
        font-size: 18px;
      }

      .rating-btn.active {
        color: var(--color-warning);
        border-color: var(--color-warning);
      }

      @media (max-width: 900px) {
        .account-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AccountPageComponent implements OnInit {
  reservedArrangements: Arrangement[] = [];
  visitedDestinations: VisitedItem[] = [];
  readonly stars = [1, 2, 3, 4, 5];

  constructor(
    private readonly accountService: AccountService,
    readonly lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.refreshData();
  }

  canCancel(arrangement: Arrangement): boolean {
    return this.accountService.canCancel(arrangement);
  }

  cancelReservation(arrangement: Arrangement): void {
    this.accountService.cancelReservation(arrangement);
    this.refreshData();
  }

  setRating(arrangement: Arrangement, rating: number): void {
    this.accountService.rateVisited(arrangement, rating);
    this.refreshData();
  }

  t(key: 'title' | 'reserved' | 'noReserved' | 'cancel' | 'cancelHint' | 'visited' | 'noVisited' | 'rating'): string {
    const isSr = this.lang.currentLang() === 'sr';

    const labels = {
      title: isSr ? 'Мој налог' : 'My Account',
      reserved: isSr ? 'Резервисани аранжмани' : 'Reserved arrangements',
      noReserved: isSr ? 'Тренутно нема резервисаних аранжмана.' : 'There are currently no reserved arrangements.',
      cancel: isSr ? 'Откажи резервацију' : 'Cancel reservation',
      cancelHint: isSr ? 'Отказивање није могуће мање од 5 дана пре почетка.' : 'Cancellation is not available less than 5 days before start.',
      visited: isSr ? 'Посећене дестинације' : 'Visited destinations',
      noVisited: isSr ? 'Још увек нема посећених дестинација.' : 'There are no visited destinations yet.',
      rating: isSr ? 'Оцена:' : 'Rating:'
    };

    return labels[key];
  }

  trackByArrangement(_: number, arrangement: Arrangement): string {
    return `${arrangement.title}-${arrangement.place}-${arrangement.startDate}-${arrangement.endDate}`;
  }

  private refreshData(): void {
    this.accountService.syncExpiredReservations();
    this.reservedArrangements = this.accountService.getReserved();
    this.visitedDestinations = this.accountService.getVisited();
  }
}
