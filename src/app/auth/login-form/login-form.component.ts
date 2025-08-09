import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  effect,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';
import { AuthFacade } from 'src/store/auth/auth.facade';
import { User } from 'src/app/models/user.model'; // optional, only if you want strong typing

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
    private router: Router
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

    // Redirect based on role when login is successful
    effect(() => {
      if (this.authFacade.isLogged()) {
        const user = this.authFacade.user() as User | null; // assumes user() is a Signal<User | null>
        if (user) {
          if (user.role === 'utilisateur') {
            this.router.navigate(['/tabs/upcoming-booking']);
          } else if (
            user.role === 'employé' ||
            user.role === 'administrateur'
          ) {
            this.router.navigate(['/scanner']);
          } else {
            // Fallback if role missing/unexpected
            this.router.navigate(['/tabs/upcoming-booking']);
          }
        }
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
