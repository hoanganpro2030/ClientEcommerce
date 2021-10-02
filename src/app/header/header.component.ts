import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from '../services/authentication.service';
import {NotificationService} from '../services/notification.service';
import {NotificationType} from '../enum/notification-type.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  language = 'en';
  public isLoggedin: boolean;
  constructor(private translate: TranslateService, public authenticationService: AuthenticationService,
              private notificationService: NotificationService) {}

  ngOnInit(): void {}

  onChangeEn(): void {
    this.translate.use('en');
    this.language = 'en';
  }

  onChangeFr(): void {
    this.translate.use('fr');
    this.language = 'fr';
  }

  onLogout(): void {
    this.authenticationService.logout();
    this.notificationService.notify(NotificationType.INFO, 'You are now logged out');
  }
}
