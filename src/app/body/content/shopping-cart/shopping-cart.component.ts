import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Project, Status} from '../../../model/project.model';
import {ResponseMessage} from '../../../model/response.message';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ProjectService} from '../../../services/project.service';
import {SearchService} from '../../../services/search.service';
import {PaginateService} from '../../../services/paginate.service';
import {ShoppingCartService} from '../../../services/shopping-cart.service';
import {SingleCart} from '../../../model/single-cart.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ProductsOrder} from '../../../model/products-order.model';
import {PurchaseOrder} from '../../../model/purchase-order.model';
import {StatusOrder} from '../../../enum/status-order';
import {NotificationService} from '../../../services/notification.service';
import {NotificationType} from '../../../enum/notification-type.enum';
import {Router} from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cartForm: FormGroup;
  infoForm: FormGroup;
  public productCarts: SingleCart[];
  public response: ResponseMessage;
  public error: string;
  public totalPage;
  public currentPage;
  public countCheck;
  public isSubmit = false;
  public po: PurchaseOrder;

  constructor(private dataStorageService: DataStorageService,
              private projectService: ProjectService,
              private searchService: SearchService,
              private paginateService: PaginateService,
              public cartService: ShoppingCartService,
              public dialog: MatDialog,
              private _formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.cartForm = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
    });
    this.infoForm = new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'),
        Validators.maxLength(10), Validators.minLength(7)]),
      address: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      province: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      district: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      ward: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      note: new FormControl('')
    });

    this.productCarts = this.cartService.productCarts;
    if (this.productCarts.length === 0) {
      const productCartsString = localStorage.getItem('productCarts');
      if (productCartsString) {
        this.productCarts = JSON.parse(productCartsString);
        this.cartService.productCarts = this.productCarts;
        this.cartService.updateTotalPrice();
      }
    }
    this.dataStorageService.triggerPagination.subscribe(rp => {
      this.totalPage = this.paginateService.data.total;
      this.currentPage = this.paginateService.data.current;
    });
    if (this.paginateService.data){
      this.totalPage = this.paginateService.data.total;
      this.currentPage = this.paginateService.data.current;
    }
    this.onChangeCheckBox();
  }

  onOrder(): void {
    this.isSubmit = true;
    const formValue = this.infoForm.value;
    const detail: ProductsOrder[] = [];
    this.cartService.productCarts.forEach(pd => {
      const productOrder: ProductsOrder = {
        productId: pd.product.id,
        quantity: pd.quantity
      };
      detail.push(productOrder);
    });
    this.po = {
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
    this.dataStorageService.createPurchaseOrder(this.po).subscribe(response => {
      this.cartService.clearCart();
      this.productCarts = this.cartService.productCarts;
      this.notificationService.notify(NotificationType.SUCCESS, 'Order success');
    }, error => {
      this.notificationService.notify(NotificationType.ERROR, error.error.message);
    });
  }

  onDecreseQuantity(productCart: SingleCart) {
    if (productCart.quantity === 1) {
      this.onDelete(productCart.product.id);
    } else if (productCart.quantity > 1) {
      productCart.quantity -= 1;
      this.cartService.updateTotalPrice();
    }
  }

  onIncreseQuantity(productCart: SingleCart) {
    if (productCart.product.quantity === productCart.quantity) {
      this.error = productCart.product.name + ' is out of stock.';
      return;
    }
    productCart.quantity += 1;
    this.cartService.updateTotalPrice();
  }

  onDelete(id: number) {
    this.openDeleteDialog(id);
  }

  onDeleteMany() {
    let ids = this.productCarts.filter(p => p.isCheck).map(p => p.product.id);
    this.openDeleteMultiDialog(ids);
  }

  onChangeCheckBox() {
    let ids = this.productCarts.filter(p => p.isCheck).map(p => p.product.id);
    this.countCheck = ids.length;
  }

  openDeleteDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteCartItemDialog, {data: false});
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cartService.deleteProducts(id);
      }
    });
  }

  openDeleteMultiDialog(ids: number[]) {
    const dialogRef = this.dialog.open(ConfirmDeleteCartItemDialog, {data: true});
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cartService.deleteMultiProducts(ids);
        this.countCheck = 0;
      }
    });
  }

}

@Component({
  selector: 'confirm-delete-cart-item-dialog',
  templateUrl: 'confirm-delete-cart-item-dialog.html',
})
export class ConfirmDeleteCartItemDialog {
  dynamicText: string;
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteCartItemDialog>,
              @Inject(MAT_DIALOG_DATA) public isDeleteMulti: boolean) {
    if (isDeleteMulti) {
      this.dynamicText = 'these items';
    } else {
      this.dynamicText = 'this item';
    }
  }
  onYes(): void {
    this.dialogRef.close(true);
  }
  onNo(): void {
    console.log(this.isDeleteMulti);
    this.dialogRef.close(false);
  }
}
