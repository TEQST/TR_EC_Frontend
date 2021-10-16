import {Component, OnInit} from '@angular/core';
import {ViewChild, ViewChildren, ElementRef} from '@angular/core';
import {IonTabs, IonTabButton, AlertController} from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

import {UsermgmtService} from '../services/usermgmt.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  @ViewChild(IonTabs, {static: false}) tabs: IonTabs;
  @ViewChildren(IonTabButton, {read: ElementRef}) tabbuttonsEl: any;
  @ViewChildren(IonTabButton) tabbuttons: any;

  public isPublisher: boolean;
  public isListener: boolean;

  constructor(public usermgmtService: UsermgmtService,
              public authenticationService: AuthenticationService,
              public alertController: AlertController) { }

  ngOnInit(): void {
    this.usermgmtService.getIsPublisher().subscribe((isPublisher: boolean) => {
      this.isPublisher = isPublisher;
    });
  }

  onTouch(index): void {
    this.tabs.select(this.tabbuttons.toArray()[index].tab);
  }

  ngAfterViewInit(): void {
    this.tabbuttonsEl.forEach((tabbuttonEl, index) => {
      tabbuttonEl.onTouch = this.onTouch.bind(this, index);
      tabbuttonEl.nativeElement.addEventListener(
          'touchend', tabbuttonEl.onTouch, {passive: true},
      );
    });
  }

  ngOnDestroy(): void {
    this.tabbuttonsEl.forEach((tabbuttonEl) => {
      tabbuttonEl.nativeElement
          .removeEventListener('touchend', tabbuttonEl.onTouch);
    });
  }

  async showLogoutConfirm() {
    const alert = await this.alertController.create({
      header: 'Do you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        }, {
          text: 'Yes',
          handler: () => {
            this.authenticationService.logout();
          }
        }
      ]
    });

    await alert.present();
  }
}
