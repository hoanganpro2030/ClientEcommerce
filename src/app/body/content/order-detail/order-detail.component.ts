import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { error } from 'protractor';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Product } from 'src/app/model/product.model';
import { PurchaseOrder } from 'src/app/model/purchase-order.model';
import { NotificationService } from 'src/app/services/notification.service';
import {DataStorageService} from '../../../shared/data-storage.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  public po: PurchaseOrder;
  public detail;
  public products: Product[] = []
  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataStorageService: DataStorageService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    let orderId = this.route.snapshot.params['id'];
    if (orderId) {
      this.dataStorageService.getPurchaseOrderById(orderId).subscribe((po: PurchaseOrder) => {
        this.po = po;
        this.detail = JSON.parse(po.detail);
        console.log(this.detail)

        this.dataStorageService.getProductsByIds(this.detail.map(d => d["id"])).subscribe((productList: Product[]) => {
          console.log(productList)
          this.products = productList;
        }, (error: HttpErrorResponse) => {
          this.notificationService.notify(NotificationType.ERROR, error.message);
        })
      }, (error: HttpErrorResponse) => {
        this.notificationService.notify(NotificationType.ERROR, error.message);
      });
    }
  }

  extractListId(detail: []): number[] {
    let listIds = [];
    return detail.map(d => d["id"]);
  }

}
