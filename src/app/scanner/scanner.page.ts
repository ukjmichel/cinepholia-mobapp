import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  IonText,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
import { ZXingScannerModule, ZXingScannerComponent } from '@zxing/ngx-scanner';
import { catchError, finalize, of, switchMap } from 'rxjs';

import { BookingService } from 'src/app/services/booking.service';
import { ScreeningService } from 'src/app/services/screening.service';

import { BookingAttributes } from 'src/app/models/booking.model';
import { PopulatedScreening } from 'src/app/models/screening.model';
import { AuthFacade } from 'src/store/auth/auth.facade';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [
    IonIcon,
    IonButtons,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonText,
    ZXingScannerModule,
  ],
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage {
  @ViewChild(ZXingScannerComponent) scanner?: ZXingScannerComponent;

  hasDevices = false;
  hasPermission = false;
  scanning = true;
  lastPayload: string | null = null;

  loading = false;
  actionBusy = false;
  errorMsg: string | null = null;

  booking?: BookingAttributes;
  screening?: PopulatedScreening;

  constructor(
    private bookingService: BookingService,
    private screeningService: ScreeningService,
    private authFacade: AuthFacade,
    private router: Router
  ) {}

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.hasDevices = !!devices?.length;
  }

  onHasPermission(granted: boolean): void {
    this.hasPermission = granted;
  }

  onScanSuccess(payload: string): void {
    if (!this.scanning) return;

    this.lastPayload = (payload || '').trim();
    const bookingId = this.extractUuid(this.lastPayload);

    if (!bookingId) {
      this.errorMsg = 'QR content does not contain a valid booking ID.';
      return;
    }

    this.scanning = false;
    this.loadDetails(bookingId);
  }

  private extractUuid(text: string): string | null {
    const uuidRegex =
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i;
    const m = (text || '').match(uuidRegex);
    return m ? m[0] : null;
  }

  private loadDetails(bookingId: string): void {
    this.errorMsg = null;
    this.loading = true;
    this.booking = undefined;
    this.screening = undefined;

    this.bookingService
      .getBookingById(bookingId)
      .pipe(
        switchMap((b) => {
          this.booking = b;
          return this.screeningService.getById(b.screeningId);
        }),
        catchError((err) => {
          this.errorMsg = this.humanizeError(err);
          return of(null);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((scr) => {
        if (scr) this.screening = scr;
      });
  }

  markAsUsed(): void {
    if (!this.booking || this.booking.status === 'used') return;

    this.actionBusy = true;
    this.bookingService
      .markBookingAsUsed(this.booking.bookingId)
      .pipe(
        catchError((err) => {
          this.errorMsg = this.humanizeError(err);
          return of(null);
        }),
        finalize(() => (this.actionBusy = false))
      )
      .subscribe((updated) => {
        if (updated) this.booking = updated;
      });
  }

  scanAnother(): void {
    this.errorMsg = null;
    this.lastPayload = null;
    this.booking = undefined;
    this.screening = undefined;
    this.scanning = true;
  }

  private humanizeError(err: any): string {
    const msg =
      err?.error?.message ||
      err?.message ||
      'Unexpected error. Please try again.';
    return typeof msg === 'string'
      ? msg
      : 'Unexpected error. Please try again.';
  }

  async requestPermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      this.hasPermission = true;
      this.errorMsg = null;
    } catch {
      this.hasPermission = false;
      this.errorMsg = 'Camera permission denied.';
    }
  }
  logout() {
    this.authFacade.logout();
    this.router.navigate(['/login']);
  }
}
