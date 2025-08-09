import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AuthFacade } from 'src/store/auth/auth.facade';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    RouterLink,
  ],
})
export class TabsPage {
  constructor(private authFacade: AuthFacade, private router: Router) {}

  logout() {
    this.authFacade.logout();
    this.router.navigate(['/login']);
  }
}
