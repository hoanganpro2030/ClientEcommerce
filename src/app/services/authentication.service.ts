import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpResponse} from '@angular/common/http';
import {User} from '../model/user.model';
import {Observable} from 'rxjs';
import {BACK_END_URL, LOGIN, REGISTER, RESET_PASSWORD, UPDATE_PROFILE_IMAGE, USER} from '../shared/constants';
import { JwtHelperService } from '@auth0/angular-jwt';
import {HttpResponseAcm} from '../model/http-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(BACK_END_URL + USER + LOGIN, user, {observe: 'response'});
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(BACK_END_URL + USER + REGISTER, user);
  }

  public resetPassword(email: string): Observable<HttpResponseAcm | HttpErrorResponse> {
    return this.http.get<HttpResponseAcm>(BACK_END_URL + USER + RESET_PASSWORD + '?email=' + email );
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User> | HttpErrorResponse> {
    return this.http.post<User>(BACK_END_URL + USER + UPDATE_PROFILE_IMAGE, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }

  public logout(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public saveUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserToLocalCache(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string {
    return this.token;
  }

  public isLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logout();
      return false;
    }
  }
}
