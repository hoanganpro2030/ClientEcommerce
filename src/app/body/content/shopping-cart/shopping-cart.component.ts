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
import { AppComponent } from 'src/app/app.component';
import { MatFormFieldControl } from '@angular/material/form-field';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddressService } from 'src/app/services/address.service';
import { Address } from 'src/app/model/address.model';

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
  public addresses: Address[];
  public selectedAddress: Address = null;

  constructor(private dataStorageService: DataStorageService,
              private projectService: ProjectService,
              private searchService: SearchService,
              private paginateService: PaginateService,
              public cartService: ShoppingCartService,
              public dialog: MatDialog,
              private _formBuilder: FormBuilder,
              private notificationService: NotificationService,
              private router: Router,
              private addressService: AddressService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.cartForm = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
    });
    this.infoForm = new FormGroup({
      sltAddress: new FormControl(''),
      fullName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'),
        Validators.maxLength(10), Validators.minLength(7)]),
      street: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      province: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      district: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      ward: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      note: new FormControl('')
    });

    // this.infoForm = this._formBuilder.group({
    //   sltAddress: ['', [Validators.maxLength(50)]],
    //   fullName: ['', [Validators.required, Validators.maxLength(50)]],
    //   phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$'),
    //     Validators.maxLength(10), Validators.minLength(7)]],
    //   address: ['', [Validators.required, Validators.maxLength(255)]],
    //   province: ['', [Validators.required, Validators.maxLength(50)]],
    //   district: ['', [Validators.required, Validators.maxLength(50)]],
    //   ward: ['', [Validators.required, Validators.maxLength(50)]],
    //   note: ['',[]]
    // });

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

    this.addresses = this.addressService.addresses;
    if (this.authenticationService.getUserFromLocalCache()) {
      this.dataStorageService.getAddressesFromUser(this.authenticationService.getUserFromLocalCache().id)
    }
    
    this.dataStorageService.triggerAddressService.subscribe(rp => {
      this.addresses = this.addressService.addresses;
      if (this.selectedAddress) {
        this.selectedAddress = this.addressService.findAddressById(this.selectedAddress.id);
      }
      console.log(this.selectedAddress)
    })
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
    let noteCombine;
    if (this.selectedAddress !== null) {
      noteCombine = formValue.note + "\n" + this.selectedAddress.note;
    } else {
      noteCombine =formValue.note;
    }
    this.po = {
      id: null,
      fullName: formValue.fullName,
      phoneNumber: formValue.phoneNumber,
      addressDetail: formValue.street,
      province: formValue.province,
      district: formValue.district,
      ward: formValue.ward,
      note: formValue.note + "\n" + this.selectedAddress.note,
      totalPrice: this.cartService.totalPrice,
      detail: JSON.stringify(detail),
      orderDate: null,
      status: StatusOrder.NEW,
      version: null
    };
    this.dataStorageService.createPurchaseOrder(this.po).subscribe(response => {
      this.cartService.clearCart();
      this.productCarts = this.cartService.productCarts;
      this.dataStorageService.triggerCartService.next();
      this.notificationService.notify(NotificationType.SUCCESS, 'Order success');
    }, error => {
      this.notificationService.notify(NotificationType.ERROR, error.error.message);
    });
  }

  onSelectAddress($event) {
    this.selectedAddress = $event.value;
    this.infoForm.controls.phoneNumber.setValue(this.selectedAddress.phoneNumber);
    this.infoForm.controls.province.setValue(this.selectedAddress.province);
    this.infoForm.controls.district.setValue(this.selectedAddress.district);
    this.infoForm.controls.ward.setValue(this.selectedAddress.ward);
    this.infoForm.controls.street.setValue(this.selectedAddress.street);
  }

  onDecreseQuantity(productCart: SingleCart) {
    if (productCart.quantity === 1) {
      this.onDelete(productCart.product.id);
    } else if (productCart.quantity > 1) {
      productCart.quantity -= 1;
      this.cartService.updateTotalPrice();
    }
  }

  onNewAddress(): void {
    this.openNewAddressDialog();
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
        this.dataStorageService.triggerCartService.next();
      }
    });
  }

  openDeleteMultiDialog(ids: number[]) {
    const dialogRef = this.dialog.open(ConfirmDeleteCartItemDialog, {data: true});
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cartService.deleteMultiProducts(ids);
        this.countCheck = 0;
        this.dataStorageService.triggerCartService.next();
      }
    });
  }

  openNewAddressDialog(): void {
    const dialogRef = this.dialog.open(NewAddressDialog, {});

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  onEditAddress(address: Address): void {
    const dialogRef = this.dialog.open(NewAddressDialog, {data: address});

    dialogRef.afterClosed().subscribe(result => {
      
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

@Component({
  selector: 'new-address-dialog',
  templateUrl: 'new-address-dialog.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class NewAddressDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<NewAddressDialog>, 
    private dataStorageService: DataStorageService, 
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public address: Address
  ) {}

  ngOnInit(): void {
    if (this.address != null) {
      this.addressForm = new FormGroup({
        title: new FormControl(this.address.title, [Validators.required, Validators.maxLength(50)]),
        phoneNumber: new FormControl(this.address.phoneNumber, [Validators.required, Validators.pattern('^[0-9]*$'),
            Validators.maxLength(10), Validators.minLength(7)]),
        province: new FormControl(this.address.province, [Validators.required, Validators.maxLength(50)]),
        district: new FormControl(this.address.district, [Validators.required, Validators.maxLength(50)]),
        ward: new FormControl(this.address.ward, [Validators.required, Validators.maxLength(50)]),
        street: new FormControl(this.address.street, [Validators.required, Validators.maxLength(255)]),
        note: new FormControl(this.address.note),
        isDefault: new FormControl(this.address.isDefault)
      })
      this.isUpdate = true;
    }
  }

  isSubmit: boolean = false;
  isUpdate: boolean = false;
  addressForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'),
        Validators.maxLength(10), Validators.minLength(7)]),
    province: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    district: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    ward: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    street: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    note: new FormControl(''),
    isDefault: new FormControl(false)
  })

  onSubmit(): void {
    this.isSubmit = true;
    if (this.addressForm.valid) {
      if (this.isUpdate === false) {
        this.dataStorageService.createNewAddress(this.addressForm.value)
      } else {
        let addressUpdate: Address = this.addressForm.value;
        addressUpdate['id'] = this.address.id;
        this.dataStorageService.updateAddress(this.addressForm.value)
      }
      
      this.dialogRef.close(true);
    }
  }

  onYes(): void {
    this.dialogRef.close(true);
  }
  onNo(): void {
    this.dialogRef.close(false);
  }
}