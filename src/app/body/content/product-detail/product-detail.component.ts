import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../../shared/data-storage.service';
import {Product, ProductType} from '../../../model/product.model';
import {ShoppingCartService} from '../../../services/shopping-cart.service';
import {SingleCart} from '../../../model/single-cart.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  public productId = null;
  public quantity: number;
  public error: string;
  public product: Product = {
    id: null,
    name: null,
    description: null,
    quantity: null,
    price: null,
    image: null,
    dateStockIn: null,
    version: null,
    productType: null,
  };
  constructor(private router: Router,
              private route: ActivatedRoute,
              private dataStorageService: DataStorageService,
              private cartService: ShoppingCartService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.quantity = 1;
    this.dataStorageService.triggerProductEntity.subscribe(product => {
      this.product = product;
    });
    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.dataStorageService.getProductById(this.productId);
    }
  }

  onIncreaseQuantity() {
    this.quantity += 1;
  }

  onDecreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  onBuyNow() {
    if (this.quantity <= 0) {
      return;
    }
    if (this.validateStockQuant() === false) {
      return;
    }
    let singleCart: SingleCart = {
      product: this.product,
      quantity: this.quantity,
      isCheck: false,
    };
    this.cartService.insertProduct(singleCart);
    this.router.navigate(['/shopping-cart']);
  }

  onAddtoCart() {
    if (this.quantity <= 0) {
      return;
    }
    if (this.validateStockQuant() === false) {
      return;
    }
    let singleCart: SingleCart = {
      product: this.product,
      quantity: this.quantity,
      isCheck: false,
    };
    this.openDialog(singleCart);
  }

  private validateStockQuant(): boolean {
    const productInCart = this.cartService.productCarts.find(c => c.product.id === this.product.id);
    let quantityInCart = 0;
    if (productInCart != null) {
      quantityInCart = productInCart.quantity;
    }
    if (this.product.quantity < this.quantity + quantityInCart) {
      this.error = 'Only have ' + (this.product.quantity - quantityInCart) + ' products of this kind';
      return false;
    }
    return true;
  }

  openDialog(singleCart) {
    const dialogRef = this.dialog.open(DialogElementsExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result === false) {
        this.cartService.insertProduct(singleCart);
        this.router.navigate(['/product-list']);
      } else if (result === true) {
        this.cartService.insertProduct(singleCart);
        this.router.navigate(['/shopping-cart']);
      } else {
        return;
      }
    });
  }

}

@Component({
  selector: 'dialog-elements-example-dialog',
  templateUrl: 'dialog-elements-example-dialog.html',
})
export class DialogElementsExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogElementsExampleDialog>) {}
  onContinueShopping(): void {
    this.dialogRef.close(false);
  }
  onCheckout(): void {
    this.dialogRef.close(true);
  }
}
