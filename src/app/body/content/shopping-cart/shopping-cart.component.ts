import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Project, Status} from '../../../model/project.model';
import {ResponseMessage} from '../../../model/response.message';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ProjectService} from '../../../services/project.service';
import {SearchService} from '../../../services/search.service';
import {PaginateService} from '../../../services/paginate.service';
import {ShoppingCartService} from '../../../services/shopping-cart.service';
import {SingleCart} from '../../../model/single-cart.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  searchFrom = new FormGroup({
    searchText: new FormControl(this.searchService.text),
    searchStatus: new FormControl(this.searchService.status)
  })
  public projects: Project[];
  public productCarts: SingleCart[];
  public ps = Status;
  public response: ResponseMessage;
  public error: string;
  public totalPage;
  public currentPage;
  public countCheck;

  constructor(private dataStorageService: DataStorageService,
              private projectService: ProjectService,
              private searchService: SearchService,
              private paginateService: PaginateService,
              public cartService: ShoppingCartService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.productCarts = this.cartService.productCarts;
    console.log(this.productCarts.length);
    if (this.productCarts.length === 0) {
      const productCartsString = localStorage.getItem('productCarts');
      console.log(productCartsString);
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

  onSubmit() {
    if (this.searchFrom.value.searchText) {
      this.searchService.text = this.searchFrom.value.searchText;
    }
    if (this.searchFrom.value.searchStatus != '-1') {
      this.searchService.status = this.searchFrom.value.searchStatus;
    }
    this.dataStorageService.searchProjects(this.searchFrom.value.searchText, this.searchFrom.value.searchStatus, 0);
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
