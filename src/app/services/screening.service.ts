import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookedSeat, PopulatedScreening } from '../models/screening.model';

/**
 * Service to manage operations related to movie screenings.
 *
 * - Fetch screening details by ID (handles populated movie/theater/hall).
 * - Retrieve booked seats for a screening.
 * - Normalizes API fields: price (string→number), startTime (string→Date).
 */
@Injectable({ providedIn: 'root' })
export class ScreeningService {
  /** Base URL for screening-related API endpoints. */
  private baseUrl = `${environment.apiUrl}screenings/`;

  constructor(private http: HttpClient) {}

  /**
   * GET /screenings/:screeningId
   * Accepts both `{ data: ... }` and plain object responses.
   * Normalizes `price` and `startTime`.
   */
  getById(screeningId: string): Observable<PopulatedScreening> {
    return this.http
      .get<
        { message?: string; data?: PopulatedScreening } | PopulatedScreening
      >(`${this.baseUrl}${screeningId}`)
      .pipe(
        map((res: any) => (res?.data ?? res) as PopulatedScreening),
        map((scr) => ({
          ...scr,
          price:
            typeof scr.price === 'string' ? parseFloat(scr.price) : scr.price,
          startTime:
            typeof scr.startTime === 'string'
              ? new Date(scr.startTime)
              : scr.startTime,
        }))
      );
  }

  /**
   * GET /screenings/:screeningId/booked-seats
   */
  getBookedSeats(screeningId: string): Observable<BookedSeat[]> {
    return this.http
      .get<{ message?: string; data?: BookedSeat[] } | BookedSeat[]>(
        `${this.baseUrl}${screeningId}/booked-seats`
      )
      .pipe(map((res: any) => (res?.data ?? res) as BookedSeat[]));
  }
}
