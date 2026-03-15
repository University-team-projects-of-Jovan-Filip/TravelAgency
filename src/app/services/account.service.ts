import { Injectable } from '@angular/core';
import { Arrangement, ArrangementsService } from './arrangements.service';

interface VisitedItem {
  arrangement: Arrangement;
  rating: number | null;
}

const RESERVED_KEY = 'travel-agency.reserved';
const VISITED_KEY = 'travel-agency.visited';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private readonly arrangements: ArrangementsService) {
    this.ensureStorageShape();
    this.ensureSeedVisited();
  }

  getReserved(): Arrangement[] {
    return this.readFromStorage<Arrangement[]>(RESERVED_KEY, []);
  }

  getVisited(): VisitedItem[] {
    return this.readFromStorage<VisitedItem[]>(VISITED_KEY, []);
  }

  isReserved(arrangement: Arrangement): boolean {
    return this.getReserved().some(item => this.isSameArrangement(item, arrangement));
  }

  reserve(arrangement: Arrangement): boolean {
    const reserved = this.getReserved();
    if (reserved.some(item => this.isSameArrangement(item, arrangement))) {
      return false;
    }

    this.writeToStorage(RESERVED_KEY, [...reserved, arrangement]);
    return true;
  }

  getAverageRating(arrangement: Arrangement): number {
    const visited = this.getVisited();
    const ratings = visited
      .filter(v => this.isSameArrangement(v.arrangement, arrangement))
      .map(v => v.rating)
      .filter((r): r is number => typeof r === 'number' && r >= 1 && r <= 5);

    if (ratings.length === 0) {
      return 0;
    }

    const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    return Math.round(avg * 10) / 10;
  }

  canCancel(arrangement: Arrangement): boolean {
    return this.daysUntilStart(arrangement.startDate) >= 5;
  }

  cancelReservation(arrangement: Arrangement): boolean {
    if (!this.canCancel(arrangement)) {
      return false;
    }

    const reserved = this.getReserved().filter(item => !this.isSameArrangement(item, arrangement));
    this.writeToStorage(RESERVED_KEY, reserved);
    return true;
  }

  rateVisited(arrangement: Arrangement, rating: number): void {
    const clamped = Math.max(1, Math.min(5, Math.round(rating)));

    const visited = this.getVisited();
    const nextVisited = visited.map(item => {
      if (this.isSameArrangement(item.arrangement, arrangement)) {
        return { ...item, rating: clamped };
      }

      return item;
    });

    this.writeToStorage(VISITED_KEY, nextVisited);
  }

  syncExpiredReservations(now: Date = new Date()): void {
    const reserved = this.getReserved();
    if (reserved.length === 0) {
      return;
    }

    const visited = this.getVisited();
    const today = this.startOfDay(now);

    const remainingReservations: Arrangement[] = [];
    const nextVisited = [...visited];

    for (const arrangement of reserved) {
      const end = new Date(arrangement.endDate);
      if (Number.isNaN(end.getTime())) {
        // invalid end date, keep in reserved
        remainingReservations.push(arrangement);
        continue;
      }

      const endDate = this.startOfDay(end);
      if (endDate < today) {
        const alreadyVisited = nextVisited.some(item => this.isSameArrangement(item.arrangement, arrangement));
        if (!alreadyVisited) {
          nextVisited.push({ arrangement, rating: null });
        }
      } else {
        remainingReservations.push(arrangement);
      }
    }

    this.writeToStorage(RESERVED_KEY, remainingReservations);
    this.writeToStorage(VISITED_KEY, nextVisited);
  }

  private ensureStorageShape(): void {
    const reserved = this.readFromStorage<Arrangement[]>(RESERVED_KEY, []);
    const visited = this.readFromStorage<VisitedItem[]>(VISITED_KEY, []);

    this.writeToStorage(RESERVED_KEY, reserved);
    this.writeToStorage(VISITED_KEY, visited);
  }

  private ensureSeedVisited(): void {
    const existing = this.readFromStorage<VisitedItem[]>(VISITED_KEY, []);
    if (existing.length > 0) {
      return;
    }

    const all = this.arrangements.getAll();
    const pick = (id: string) => all.find(a => a.id === id) ?? null;

    const a1 = pick('evropa-london-haversham-court');
    const a2 = pick('leto-2025-valensia-playa-del-sol');

    const seed: VisitedItem[] = [];
    if (a1) seed.push({ arrangement: { ...a1, title: `Past opportunity: ${a1.title}` }, rating: 4 });
    if (a2) seed.push({ arrangement: { ...a2, title: `Past opportunity: ${a2.title}` }, rating: 5 });

    if (seed.length > 0) {
      this.writeToStorage(VISITED_KEY, seed);
    }
  }

  private isSameArrangement(first: Arrangement, second: Arrangement): boolean {
    return first.title === second.title
      && first.place === second.place
      && first.startDate === second.startDate
      && first.endDate === second.endDate;
  }

  private daysUntilStart(startDateValue: string): number {
    const today = this.startOfDay(new Date());
    const startDate = this.startOfDay(new Date(startDateValue));
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((startDate.getTime() - today.getTime()) / msPerDay);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private readFromStorage<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private writeToStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
