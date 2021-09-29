import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {BACK_END_URL, LOGIN, REGISTER, RESET_PASSWORD, TOKEN_PREFIX, USER} from '../shared/constants';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<unknown>> {
    if (httpRequest.url.includes(BACK_END_URL + USER + LOGIN)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(BACK_END_URL + USER + REGISTER)) {
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(BACK_END_URL + USER + RESET_PASSWORD)) {
      return httpHandler.handle(httpRequest);
    }
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    if (token != null && token !== '') {
      const request = httpRequest.clone({ setHeaders: { Authorization: TOKEN_PREFIX + token}});
      return httpHandler.handle(request);
    }
    return httpHandler.handle(httpRequest);
  }
}
