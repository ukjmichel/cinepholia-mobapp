import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  BookingAttributes,
  BookingPayload,
  BookingUpdateDto,
} from '../models/booking.model';

/**
 * Service to manage booking operations via HTTP.
 *
 * Provides methods to:
 * - Fetch, create, update, and cancel bookings
 * - Mark bookings as used
 * - Get bookings for a user, or only upcoming bookings
 * - Signal variables for component state
 *
 * All requests use credentials (cookies).
 */
@Injectable({ providedIn: 'root' })
export class BookingService {
  /** The base URL for the bookings API. */
  private baseUrl = `${environment.apiUrl}bookings/`;

  /** Holds the latest booking operation result (for UI feedback). */
  public latestBookingResult = signal<any>(null);

  /** Holds the user's bookings for UI or state management. */
  public userBookings = signal<BookingAttributes[]>([]);

  /** Holds all bookings (admin/staff view). */
  public allBookings = signal<BookingAttributes[]>([]);

  /**
   * Constructor injecting Angular's HttpClient.
   * @param http The HTTP client used for API requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Get a single booking by its ID.
   *
   * @param bookingId - The booking UUID.
   * @returns Observable<BookingAttributes> - The booking details.
   */
  getBookingById(bookingId: string): Observable<BookingAttributes> {
    return this.http
      .get<{ message: string; data: BookingAttributes }>(
        this.baseUrl + bookingId,
        { withCredentials: true }
      )
      .pipe(map((res) => res.data));
  }

  /**
   * Mark a booking as "used".
   * Only available to staff members.
   *
   * @param bookingId - The booking UUID.
   * @returns Observable<BookingAttributes> - The updated booking.
   */
  markBookingAsUsed(bookingId: string): Observable<BookingAttributes> {
    return this.http
      .patch<{ message: string; data: BookingAttributes }>(
        `${this.baseUrl}${bookingId}/used`,
        {},
        { withCredentials: true }
      )
      .pipe(map((res) => res.data));
  }

  /**
   * Cancel a booking (only owner or staff can cancel).
   *
   * @param bookingId - The booking UUID.
   * @returns Observable<BookingAttributes> - The updated (canceled) booking.
   */
  cancelBooking(bookingId: string): Observable<BookingAttributes> {
    return this.http
      .patch<{ message: string; data: BookingAttributes }>(
        `${this.baseUrl}${bookingId}/cancel`,
        {},
        { withCredentials: true }
      )
      .pipe(map((res) => res.data));
  }

  /**
   * Get all bookings for a specific user (regardless of screening date).
   *
   * @param userId - The user's UUID.
   * @returns Observable<BookingAttributes[]> - All bookings for the user.
   */
  getBookingsByUser(userId: string): Observable<BookingAttributes[]> {
    return this.http
      .get<{ message: string; data: BookingAttributes[] }>(
        `${this.baseUrl}user/${userId}`,
        { withCredentials: true }
      )
      .pipe(map((res) => res.data));
  }

  /**
   * Get all upcoming bookings for a specific user.
   *
   * This will return all bookings for the given user where the screening is
   * scheduled for today or in the future (past bookings are excluded).
   * Requires authentication. Only the user themself or staff can access.
   *
   * @param userId - The UUID of the user.
   * @returns Observable<BookingAttributes[]> - List of upcoming bookings.
   */
  getUpcomingBookingsByUser(userId: string): Observable<BookingAttributes[]> {
    return this.http
      .get<{ message: string; data: BookingAttributes[] }>(
        `${this.baseUrl}user/${userId}/upcoming`,
        { withCredentials: true }
      )
      .pipe(map((res) => res.data));
  }

  
}
