import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResponseMessage} from '../../../model/response.message';
import {STATUS_CODE} from '../../../shared/status-code';
import {Subscription} from 'rxjs';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ShoppingCartService} from '../../../services/shopping-cart.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {NotificationService} from '../../../services/notification.service';
import {User} from '../../../model/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import {NotificationType} from '../../../enum/notification-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      Validators.minLength(8)]),
    email: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.email]),
    fullName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
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
    this.dataStorageService.triggerResponse.subscribe(response => {
      this.respone = response;
      this.hasError = true;
    });
  }

  onSubmit(): void {
    this.isSubmit = true;
    if (!this.registerForm.valid) {
      return;
    }
    this.showLoading = true;
    this.isSubmit = true;
    const formValue = this.registerForm.value;
    if (formValue.password !== formValue.passwordConfirm) {
      this.notificationService.notify(NotificationType.ERROR, `Password confirm do not matches`)
      this.showLoading = false;
      return;
    }
    const user = new User();
    user.username = formValue.username;
    user.password = formValue.password;
    user.email = formValue.email;
    user.fullName = formValue.fullName;
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe((response: User) => {
        this.notificationService.notify(NotificationType.SUCCESS, `A new account was created for you. Please check your email to confirm`);
        this.showLoading = false;
        this.router.navigateByUrl('/login');
      }, (error: HttpErrorResponse)  => {
        console.log(error);
        this.notificationService.notify(NotificationType.ERROR, error.error.message);
        this.showLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


}
