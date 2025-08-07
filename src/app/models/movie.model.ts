export interface MovieAttributes {
  movieId: string;
  title: string;
  description: string;
  ageRating: string;
  genre: string;
  releaseDate: string; // Note: Use string here for JSON API compatibility
  director: string;
  durationMinutes: number;
  posterUrl?: string;
  recommended?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
