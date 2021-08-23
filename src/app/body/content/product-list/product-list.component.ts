import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Status} from '../../../model/project.model';
import {ResponseMessage} from '../../../model/response.message';
import {DataStorageService} from '../../../shared/data-storage.service';
import {SearchService} from '../../../services/search.service';
import {PaginateService} from '../../../services/paginate.service';
import {Product} from '../../../model/product.model';
import {ProductService} from '../../../services/product.service';
import {SIZE_PAGE_PRODUCT_LIST} from '../../../shared/constants';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  searchFrom = new FormGroup({
    searchText: new FormControl(this.searchService.text),
    searchStatus: new FormControl(this.searchService.status)
  })
  public products: Product[];
  public bagsProducts: Product[][];
  public ps = Status;
  public response: ResponseMessage;
  public error = false;
  public totalPage;
  public currentPage;
  public countCheck;

  constructor(private dataStorageService: DataStorageService,
              private productService: ProductService,
              private searchService: SearchService,
              private paginateService: PaginateService) {
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
      let arr = [];
      let i = 0;
      this.productService.bagProduct = [];
      const NUMPERLINE = 3;
      this.products.forEach(p => {
        arr.push(p);
        i++;
        if (i % NUMPERLINE === 0){
          this.productService.bagProduct.push(arr);
          arr = [];
          i = 0;
        }
      });
      if (i % NUMPERLINE !== 0){
        this.productService.bagProduct.push(arr);
      }
      this.bagsProducts = this.productService.bagProduct;
      console.log(this.bagsProducts);
    });

    this.dataStorageService.triggerResponse.subscribe(response => {
      this.response = response;
      this.error = true;
    });
  }

  onSubmit() {
    if (this.searchFrom.value.searchText) {
      this.searchService.text = this.searchFrom.value.searchText;
    }
    if (this.searchFrom.value.searchStatus !== '-1') {
      this.searchService.status = this.searchFrom.value.searchStatus;
    }
    this.dataStorageService.searchProjects(this.searchFrom.value.searchText, this.searchFrom.value.searchStatus, 0);
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
    this.searchService.text = '';
    this.searchService.status = '-1';
  }

  onChangePage(page: number){
    if (this.searchService.status && this.searchService.status !== '-1' || this.searchService.text) {
      this.dataStorageService.searchProjects(this.searchService.text, this.searchService.status, page);
    }
    else{
      this.dataStorageService.fetchAllProducts(page, SIZE_PAGE_PRODUCT_LIST);
    }

  }

  onBackPage(){
    if (this.currentPage === 0){
      return;
    }
    if (this.searchService.status && this.searchService.status !== '-1' || this.searchService.text) {
      this.dataStorageService.searchProjects(this.searchService.text, this.searchService.status, this.currentPage - 1);
    }
    else{
      this.dataStorageService.fetchAllProducts(this.currentPage - 1, SIZE_PAGE_PRODUCT_LIST);
    }

  }

  onNextPage(){
    if (this.currentPage === this.totalPage - 1){
      return;
    }
    if (this.searchService.status && this.searchService.status !== '-1' || this.searchService.text) {
      this.dataStorageService.searchProjects(this.searchService.text, this.searchService.status, this.currentPage + 1);
    }
    else{
      this.dataStorageService.fetchAllProducts(this.currentPage + 1, SIZE_PAGE_PRODUCT_LIST);
    }
  }

}
