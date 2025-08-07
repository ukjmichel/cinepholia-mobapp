export interface BookingPayload {
  userId: string;
  screeningId: string;
  seatsNumber: number;
  seatIds: string[];
  totalPrice: number;
}

export interface BookingUpdateDto {
  seatsNumber?: number;
  seatIds?: string[];
  totalPrice?: number;

}

export interface BookingAttributes {
  bookingId: string;
  userId: string;
  screeningId: string;
  seatsNumber: number;
  seatIds: string[];
  totalPrice: number;
  status: 'pending' | 'used' | 'canceled';
  createdAt: string;
  updatedAt: string;

}
