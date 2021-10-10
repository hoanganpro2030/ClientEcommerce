import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ResponseMessage} from '../../../model/response.message';
import {DataStorageService} from '../../../shared/data-storage.service';
import {PaginateService} from '../../../services/paginate.service';
import {Product, ProductType} from '../../../model/product.model';
import {ProductService} from '../../../services/product.service';
import {SIZE_PAGE_PRODUCT_LIST} from '../../../shared/constants';
import {ProductSearchService} from '../../../services/product-search.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  searchFrom = new FormGroup({
    name: new FormControl(this.productSearchService.criteria.name),
    productType: new FormControl(this.productSearchService.criteria.productType)
  });
  public products: Product[];
  public bagsProducts: Product[][];
  public productTypes = ProductType;
  public response: ResponseMessage;
  public error = false;
  public totalPage;
  public currentPage;

  constructor(private dataStorageService: DataStorageService,
              public productService: ProductService,
              private productSearchService: ProductSearchService,
              public paginateService: PaginateService) {
  }

  ngOnInit(): void {
    this.dataStorageService.triggerPagination.subscribe(rp => {
      this.totalPage = this.paginateService.data.total;
      this.currentPage = this.paginateService.data.current;
    });
    this.bagsProducts = this.productService.bagProduct;
    this.products = this.productService.products;

    if (this.paginateService.data){
      this.totalPage = this.paginateService.data.total;
      this.currentPage = this.paginateService.data.current;
    }

    this.dataStorageService.triggerProductService.subscribe(next => {
      this.products = this.productService.products;
      this.productService.bagProduct = this.dataStorageService.handleDisplayBagProducts(this.products);
      this.bagsProducts = this.productService.bagProduct;
      console.log(this.bagsProducts);
    });

    this.dataStorageService.triggerResponse.subscribe(response => {
      this.response = response;
      this.error = true;
    });
  }

  onSelect() {
    console.log("aaaaa")
  }

  onSubmit() {
    this.productSearchService.criteria.name = this.searchFrom.value.name;
    this.productSearchService.criteria.productType = this.searchFrom.value.productType;
    console.log(this.searchFrom.value);
    console.log(this.productSearchService.criteria);
    this.dataStorageService.searchProducts(this.productSearchService.criteria, 0, SIZE_PAGE_PRODUCT_LIST);
  }

  // onDelete(id: number) {
  //   this.dataStorageService.deleteProducts(id);
  // }

  // onChangeCheckBox() {
  //   let ids = this.products.filter(p => p.ischeck).map(p => p.id);
  //   this.countCheck = ids.length;
  // }

  onResetSearch() {
    this.dataStorageService.fetchAllProducts(0, SIZE_PAGE_PRODUCT_LIST);
    this.productSearchService.criteria.name = '';
    this.productSearchService.criteria.productType = '-1';
    this.searchFrom.value.name = '';
    this.searchFrom.value.productType = '-1';
  }

  onChangePage(page: number){
    if (this.productSearchService.criteria.productType && this.productSearchService.criteria.productType !== '-1'
      || this.productSearchService.criteria.name) {
      this.dataStorageService.searchProducts(this.productSearchService.criteria, page, SIZE_PAGE_PRODUCT_LIST);
    }
    else{
      this.dataStorageService.fetchAllProducts(page, SIZE_PAGE_PRODUCT_LIST);
    }

  }

  onBackPage(){
    if (this.currentPage === 0){
      return;
    }
    if (this.productSearchService.criteria.productType && this.productSearchService.criteria.productType !== '-1'
      || this.productSearchService.criteria.name) {
      this.dataStorageService.searchProducts(this.productSearchService.criteria, this.currentPage - 1, SIZE_PAGE_PRODUCT_LIST);
    }
    else{
      this.dataStorageService.fetchAllProducts(this.currentPage - 1, SIZE_PAGE_PRODUCT_LIST);
    }

  }

  onNextPage(){
    if (this.currentPage === this.totalPage - 1){
      return;
    }
    if (this.productSearchService.criteria.productType && this.productSearchService.criteria.productType !== '-1'
      || this.productSearchService.criteria.name) {
      this.dataStorageService.searchProducts(this.productSearchService.criteria, this.currentPage + 1, SIZE_PAGE_PRODUCT_LIST);
    }
    else{
      this.dataStorageService.fetchAllProducts(this.currentPage + 1, SIZE_PAGE_PRODUCT_LIST);
    }
  }

}
