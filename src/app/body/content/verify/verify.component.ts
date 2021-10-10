import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {NotificationService} from '../../../services/notification.service';
import {NotificationType} from '../../../enum/notification-type.enum';
import {HttpResponseAcm} from '../../../model/http-response.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private authenticationService: AuthenticationService,
              private router: Router,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    let code: string;
    let email: string;
    this.activatedRoute.queryParamMap.forEach(map => {
      code = map.get('code');
      email = map.get('email');
    });
    this.authenticationService.verifyAccount(code, email).subscribe((response: HttpResponseAcm) => {
      this.notificationService.notify(NotificationType.SUCCESS, response.message);
      this.router.navigateByUrl('/login');
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.notificationService.notify(NotificationType.ERROR, error.error.message);
      this.router.navigateByUrl('/login');
    });
  }

}
