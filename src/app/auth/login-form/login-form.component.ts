import {
  ChangeDetectionStrategy,
  Component,
  signal,
  Signal,
  effect,
} from '@angular/core';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // <-- Add Router here
import {
  IonInput,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonIcon,
  IonNote,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { AuthFacade } from 'src/store/auth/auth.facade';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    IonHeader,
    IonInput,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonNote,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    IonToolbar,
    IonTitle,
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);
  hide = signal(true);

  errorMessages = signal<string[]>([]);
  apiErrorMessage: Signal<string | null>;

  constructor(
    public authFacade: AuthFacade,
    private route: ActivatedRoute,
    private router: Router // <-- Inject router
  ) {
    this.apiErrorMessage = this.authFacade.error;
    this.authFacade.clearError();

    // Prefill email from query param
    const emailFromUrl = this.route.snapshot.queryParamMap.get('email');
    if (emailFromUrl) {
      this.email.setValue(emailFromUrl);
    }

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.updateErrorMessages();
        this.clearApiError();
      });

    // Redirect to upcoming booking page when login is successful
    effect(() => {
      if (this.authFacade.isLogged()) {
        this.router.navigate(['/tabs/upcoming-booking']);
      }
    });
  }

  updateErrorMessages() {
    const messages: string[] = [];
    if (this.email.hasError('required')) {
      messages.push('You must enter a value');
    }
    if (this.email.hasError('email')) {
      messages.push('Format email invalide');
    }
    this.errorMessages.set(messages);
  }

  togglePassword() {
    this.hide.update((prev) => !prev);
  }

  onSubmit() {
    if (this.email.invalid || this.password.invalid) {
      this.email.markAsTouched();
      this.password.markAsTouched();
      this.updateErrorMessages();
      return;
    }
    this.authFacade.login(this.email.value!, this.password.value!);
  }

  clearApiError() {
    this.authFacade.clearError();
  }
}
