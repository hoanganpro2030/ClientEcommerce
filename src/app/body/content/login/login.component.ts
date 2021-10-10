import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResponseMessage} from '../../../model/response.message';
import {STATUS_CODE} from '../../../shared/status-code';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ShoppingCartService} from '../../../services/shopping-cart.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductsOrder} from '../../../model/products-order.model';
import {PurchaseOrder} from '../../../model/purchase-order.model';
import {StatusOrder} from '../../../enum/status-order';
import {AuthenticationService} from '../../../services/authentication.service';
import {User} from '../../../model/user.model';
import {NotificationService} from '../../../services/notification.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {NotificationType} from '../../../enum/notification-type.enum';
import {Subscription} from 'rxjs';
import {HeaderType} from '../../../enum/header-type.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required,
      Validators.maxLength(20), Validators.minLength(8)])
  });
  public hasError = false;
  public errorClient = false;
  public respone: ResponseMessage;
  public statusCode = STATUS_CODE;
  public isSubmit = false;
  public showLoading: boolean;
  public subscriptions: Subscription[] = [];
  constructor(private dataStorageService: DataStorageService,
              private cartService: ShoppingCartService,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService, private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/product-list');
    } else {
      this.router.navigateByUrl('/login');
    }

    this.dataStorageService.triggerResponse.subscribe(response => {
      this.respone = response;
      this.hasError = true;
    });
  }

  onSubmit(): void {
    this.isSubmit = true;
    if (!this.loginForm.valid) {
      return;
    }
    this.showLoading = true;
    this.isSubmit = true;
    const formValue = this.loginForm.value;
    const user = new User();
    user.username = formValue.username;
    user.password = formValue.password;
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe((response: HttpResponse<User>) => {
        this.authenticationService.saveToken(response.headers.get(HeaderType.JWT_TOKEN));
        this.authenticationService.saveUserToLocalCache(response.body);
        this.router.navigateByUrl('/product-list');
        console.log(response);
        this.showLoading = false;
      }, (error: HttpErrorResponse)  => {
        console.log(error);
        this.sendErrorNotification(NotificationType.ERROR, error.error.message);
        this.showLoading = false;
      })
    );
  }

  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error ocucured. Please try again');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
