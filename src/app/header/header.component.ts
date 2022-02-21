import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from '../services/authentication.service';
import {NotificationService} from '../services/notification.service';
import {ShoppingCartService} from '../services/shopping-cart.service';
import {NotificationType} from '../enum/notification-type.enum';
import { SingleCart } from '../model/single-cart.model';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  language = 'en';
  public isLoggedin: boolean;
  public quantityInCart: number;
  constructor(private translate: TranslateService, public authenticationService: AuthenticationService,
              private notificationService: NotificationService, private shoppingCartService: ShoppingCartService,
              private dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    this.quantityInCart = this.shoppingCartService.productCarts.length;
    this.dataStorageService.triggerCartService.subscribe(() =>{
      this.quantityInCart = this.shoppingCartService.productCarts.length;
    })
    if (this.quantityInCart === 0) {
      const productCartsString = localStorage.getItem('productCarts');
      if (productCartsString) {
        let productCarts: SingleCart[] = JSON.parse(productCartsString);
        this.quantityInCart = productCarts.length;
        this.shoppingCartService.productCarts = productCarts;
        this.shoppingCartService.updateTotalPrice();
      }
    }
  }

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
