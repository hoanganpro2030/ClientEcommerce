import { Component, OnInit } from '@angular/core';
import { PurchaseOrder } from 'src/app/model/purchase-order.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public poList: PurchaseOrder[];

  constructor(private dataStorageService: DataStorageService) { }

  ngOnInit(): void {
    this.dataStorageService.getPurchaseOrderForLoggedInUser().subscribe(rp => {
      this.poList = rp;
    })
  }

}
