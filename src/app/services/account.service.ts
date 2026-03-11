import { Injectable } from '@angular/core';
import { Arrangement } from './arrangements.service';

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
  constructor() {
    this.ensureStorageShape();
  }

  getReserved(): Arrangement[] {
    const reserved = this.readFromStorage<Arrangement[]>(RESERVED_KEY, []);
    return reserved;
  }

  getVisited(): VisitedItem[] {
    return this.readFromStorage<VisitedItem[]>(VISITED_KEY, []);
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
    const visited = this.getVisited();
    const nextVisited = visited.map(item => {
      if (this.isSameArrangement(item.arrangement, arrangement)) {
        return { ...item, rating };
      }

      return item;
    });

    this.writeToStorage(VISITED_KEY, nextVisited);
  }

  syncExpiredReservations(): void {
    const reserved = this.getReserved();
    if (reserved.length === 0) {
      return;
    }

    const visited = this.getVisited();
    const today = this.startOfDay(new Date());

    const remainingReservations: Arrangement[] = [];
    const nextVisited = [...visited];

    for (const arrangement of reserved) {
      const endDate = this.startOfDay(new Date(arrangement.endDate));
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
