export interface ScreeningAttributes {
  screeningId: string;
  movieId: string;
  theaterId: string;
  hallId: string;
  startTime: string | Date;
  price: string | number;
}

export interface PopulatedScreening extends ScreeningAttributes {
  movie?: { movieId: string; title: string; posterUrl?: string };
  theater?: { theaterId: string; city?: string; address?: string };
  hall?: { hallId: string; quality?: string };
}

export interface BookedSeat {
  screeningId: string;
  seatId: string;
  bookingId: string;
}
