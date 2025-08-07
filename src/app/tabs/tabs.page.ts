import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon, IonHeader, IonToolbar, IonTitle } from "@ionic/angular/standalone";


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle,RouterLink],
})
export class TabsPage {
  constructor() {}
}
