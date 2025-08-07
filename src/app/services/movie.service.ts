import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieAttributes } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  /** The base URL for the movies API. */
  private baseUrl = `${environment.apiUrl}movies/`;

  // Other state signals if needed...

  constructor(private http: HttpClient) {}

  /**
   * Get a movie by its movieId.
   */
  getMovieById(movieId: string): Observable<MovieAttributes> {
    return this.http
      .get<{ message: string; data: MovieAttributes }>(this.baseUrl + movieId)
      .pipe(map((res) => res.data));
  }

  /**
   * Get a movie by a screeningId.
   *
   * Calls GET /movies/by-screening/:screeningId.
   *
   * @param screeningId - The UUID of the screening.
   * @returns Observable<MovieAttributes>
   */
  getMovieByScreeningId(screeningId: string): Observable<MovieAttributes> {
    return this.http
      .get<{ message: string; data: MovieAttributes }>(
        `${this.baseUrl}by-screening/${screeningId}`
      )
      .pipe(map((res) => res.data));
  }
}
