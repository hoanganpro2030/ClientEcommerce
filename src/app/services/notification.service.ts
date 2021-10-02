import { Injectable } from '@angular/core';
import {NotifierService} from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifier: NotifierService) {}
  public notify(type: string, message: string): void {
    // this.notifier.notify(type, message);
    if (message) {
      this.notifier.notify(type, message);
    } else {
      this.notifier.notify(type, 'An error ocucured. Please try again');
    }
  }
}
