import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthFacade } from 'src/store/auth/auth.facade';
import { User } from '../models/auth.model';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonCard,
    IonSpinner,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
  ],
})
export class ProfilePage implements OnInit {
  user?: User;
  loading = true;
  error?: string;

  constructor(
    private userService: UserService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    const user = this.authFacade.user();
    if (!user?.userId) {
      this.error = 'Utilisateur non connecté.';
      this.loading = false;
      return;
    }

    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        this.user = res.data.user;
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger le profil.';
        this.loading = false;
      },
    });
  }
}
