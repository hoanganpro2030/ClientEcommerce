import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResponseMessage} from '../../../model/response.message';
import {STATUS_CODE} from '../../../shared/status-code';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ShoppingCartService} from '../../../services/shopping-cart.service';
import {PurchaseOrder} from '../../../model/purchase-order.model';
import {ProductsOrder} from '../../../model/products-order.model';
import {StatusOrder} from '../../../enum/status-order';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent implements OnInit {

  infoForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'),
                                  Validators.maxLength(10), Validators.minLength(7)]),
    address: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    province: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    district: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    ward: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    note: new FormControl('')
  });
  public hasError = false;
  public errorClient = false;
  public respone: ResponseMessage;
  public statusCode = STATUS_CODE;
  public isSubmit = false;
  public typing: boolean = false;
  constructor(private dataStorageService: DataStorageService,
              private cartService: ShoppingCartService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.dataStorageService.triggerResponse.subscribe(response => {
      this.respone = response;
      this.hasError = true;
    });
  }

  onSubmit() {
    this.isSubmit = true;
    let formValue = this.infoForm.value;
    let detail: ProductsOrder[] = [];
    this.cartService.productCarts.forEach(pd => {
      let productOrder: ProductsOrder = {
        productId: pd.product.id,
        quantity: pd.quantity
      };
      detail.push(productOrder);
    });
    let po: PurchaseOrder = {
      id: null,
      fullName: formValue.fullName,
      phoneNumber: formValue.phoneNumber,
      addressDetail: formValue.address,
      province: formValue.province,
      district: formValue.district,
      ward: formValue.ward,
      note: formValue.note,
      totalPrice: this.cartService.totalPrice,
      detail: JSON.stringify(detail),
      orderDate: null,
      status: StatusOrder.NEW,
      version: null
    };
    this.dataStorageService.createPurchaseOrder(po);
  }

}
