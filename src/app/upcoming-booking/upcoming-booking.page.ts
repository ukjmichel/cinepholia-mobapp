import {
  Component,
  OnInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  EffectRef,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../services/booking.service';
import { BookingAttributes } from '../models/booking.model';
import { MovieService } from '../services/movie.service';
import { MovieAttributes } from '../models/movie.model';
import { AuthFacade } from 'src/store/auth/auth.facade';
import {
  IonContent,
  IonSpinner,
  IonNote,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode';
import { forkJoin } from 'rxjs';

// Register Swiper web component globally (once in your app)
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-upcoming-booking',
  templateUrl: './upcoming-booking.page.html',
  styleUrls: ['./upcoming-booking.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonContent,
    IonSpinner,
    IonNote,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    QRCodeComponent,
  ],
})
export class UpcomingBookingPage implements OnInit, OnDestroy {
  bookings: BookingAttributes[] = [];
  movieDetailsMap = new Map<string, MovieAttributes>();
  loading = true;
  userId?: string;

  private swiperInstance: any = null;
  private userEffectRef?: EffectRef;

  @ViewChild('swiperEl', { static: false }) swiperElRef!: ElementRef;

  constructor(
    private bookingService: BookingService,
    private movieService: MovieService,
    private authFacade: AuthFacade
  ) {
    // THIS IS THE CORRECT PLACE FOR effect()
    this.userEffectRef = effect(() => {
      const user = this.authFacade.user();
      if (user?.userId) {
        this.userId = user.userId;
        this.loadBookings();
      } else {
        this.loading = false;
        this.bookings = [];
        this.movieDetailsMap.clear();
      }
    });
  }

  ngOnInit() {
    // Do not use effect() here
  }

  ngOnDestroy() {
    this.userEffectRef?.destroy();
  }

  private loadBookings() {
    if (!this.userId) return;
    this.loading = true;
    this.bookingService.getUpcomingBookingsByUser(this.userId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.movieDetailsMap.clear();
        if (!bookings.length) {
          this.loading = false;
          return;
        }
        const observables = bookings.map((b) =>
          this.movieService.getMovieByScreeningId(b.screeningId)
        );
        forkJoin(observables).subscribe({
          next: (movies) => {
            bookings.forEach((b, i) =>
              this.movieDetailsMap.set(b.screeningId, movies[i])
            );
            this.loading = false;
            setTimeout(() => this.tryInitSwiper(), 0);
          },
          error: () => {
            this.loading = false;
          },
        });
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSwiperInit(event: any) {
    this.swiperInstance = event.detail?.[0] || event.target?.swiper || null;
  }

  private tryInitSwiper() {
    if (this.swiperElRef?.nativeElement) {
      this.swiperInstance =
        this.swiperElRef.nativeElement.swiper || this.swiperInstance;
    }
  }

  getMovieForBooking(booking: BookingAttributes): MovieAttributes | undefined {
    return this.movieDetailsMap.get(booking.screeningId);
  }

  slidePrev() {
    if (!this.swiperInstance && this.swiperElRef?.nativeElement) {
      this.swiperInstance = this.swiperElRef.nativeElement.swiper;
    }
    if (this.swiperInstance && this.bookings.length > 1) {
      this.swiperInstance.slidePrev();
    }
  }

  slideNext() {
    if (!this.swiperInstance && this.swiperElRef?.nativeElement) {
      this.swiperInstance = this.swiperElRef.nativeElement.swiper;
    }
    if (this.swiperInstance && this.bookings.length > 1) {
      this.swiperInstance.slideNext();
    }
  }

  trackByBookingId(index: number, booking: BookingAttributes): string {
    return booking.bookingId;
  }
}
