import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ProjectService} from "../services/project.service";
import {Project} from "../model/project.model";
import {Subject} from "rxjs";
import {
  BACK_END_URL,
  CREATE,
  DELETE,
  DELETE_MANY,
  GET_ALL,
  GROUP_ENDPOINT,
  PROJECT_ENDPOINT,
  SEARCH,
  STATUS_PARAM,
  TEXT_PARAM,
  UPDATE,
  PRODUCT_ENDPOINT
} from "./constants";
import {ResponseMessage} from "../model/response.message";
import {Group} from "../model/group.model";
import {GroupService} from "../services/group.service";
import {ErrorService} from "../services/error.service";
import {PaginateModel} from "../model/paginate.model";
import {PaginateService} from "../services/paginate.service";
import {Employee} from "../model/employee.model";
import {EmployeeService} from "../services/employee.service";
import {ProductService} from '../services/product.service';
import {Product} from '../model/product.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
  public triggerProjectService: Subject<any> = new Subject<any>();
  public triggerPagination: Subject<any> = new Subject<any>();
  public triggerProjectEntity: Subject<Project> = new Subject<Project>();
  public triggerGroupService: Subject<Group[]> = new Subject<Group[]>();
  public triggerResponse: Subject<ResponseMessage> = new Subject<ResponseMessage>();
  public triggerNavigate: Subject<Project> = new Subject<Project>();
  public triggerBackToSearchProject: Subject<void> = new Subject<void>();
  public triggerErrorPage: Subject<any> = new Subject<any>();
  public triggerEmployeeService: Subject<any> = new Subject<any>();
  public triggerProductService: Subject<any> = new Subject<any>();
  public triggerProductEntity: Subject<Product> = new Subject<Product>();
  error: string;

  constructor(private http: HttpClient,
              private projectService: ProjectService,
              private groupService: GroupService,
              private errorService: ErrorService,
              private paginateService: PaginateService,
              private employeeService: EmployeeService,
              private productService: ProductService) {
  }

  fetchAllProjects(page) {
    return this.http.get<PaginateModel>(BACK_END_URL + PROJECT_ENDPOINT + GET_ALL + "/" + page).subscribe(response => {
      this.projectService.projects = response.data;
      this.paginateService.data = response;
      this.triggerProjectService.next();
      this.triggerPagination.next();
    });
  }


  searchProjects(searchText: string, searchStatus: string, page:number) {

    if (searchStatus === '-1') {
      searchStatus = ''
    }
    let params = "?" + TEXT_PARAM + searchText + "&" + STATUS_PARAM + searchStatus;
    return this.http.get<PaginateModel>(BACK_END_URL + PROJECT_ENDPOINT + SEARCH + '/' + page + params).subscribe(response => {
      this.projectService.projects = response.data;
      this.paginateService.data = response;
      this.triggerProjectService.next();
      this.triggerPagination.next();
    });
  }

  deleteProjects(id: number) {
    this.http.delete<ResponseMessage>(BACK_END_URL + PROJECT_ENDPOINT + DELETE + "/" + id).subscribe(response => {
      this.projectService.deleteProjects(id);
      this.triggerProjectService.next();
    }, error => {
      this.triggerResponse.next();
    });
  }

  deleteMultiProject(ids: number[]) {
    this.http.post<ResponseMessage>(BACK_END_URL + PROJECT_ENDPOINT + DELETE_MANY, ids).subscribe(response => {
      for (let id of ids) {
        this.projectService.deleteProjects(id);
      }
      this.triggerProjectService.next();
    }, error => {
      this.triggerResponse.next(error.error);
    });
  }

  createNewProject(project) {
    this.http.post<ResponseMessage>(BACK_END_URL + PROJECT_ENDPOINT + CREATE, project).subscribe(response => {
      this.triggerProjectService.next();
      this.triggerNavigate.next();
    }, error => {
      this.triggerResponse.next(error.error);
    });
  }

  fetchAllProducts(page, size) {
    return this.http.get<PaginateModel>(BACK_END_URL + PRODUCT_ENDPOINT + GET_ALL + "/" + page + "/" + size ).subscribe(response => {
      this.productService.products = response.data;
      this.paginateService.data = response;
      this.triggerProductService.next();
      this.triggerPagination.next();
    });
  }

  searchProducts(criteria, page, size) {
    if (criteria.productType === '-1' || criteria.productType === '') {
      criteria.productType = null;
    }
    console.log(criteria);
    return this.http.post<PaginateModel>(BACK_END_URL + PRODUCT_ENDPOINT + SEARCH + '/' + page + '/' + size, criteria).subscribe(response => {
      this.productService.products = response.data;
      this.paginateService.data = response;
      this.triggerProductService.next();
      this.triggerPagination.next();
    });
  }

  deleteProducts(id: number) {
    this.http.delete<ResponseMessage>(BACK_END_URL + PRODUCT_ENDPOINT + DELETE + "/" + id).subscribe(response => {
      this.productService.deleteProducts(id);
      this.triggerProductService.next();
    }, error => {
      this.triggerResponse.next();
    });
  }

  createNewProduct(product) {
    this.http.post<ResponseMessage>(BACK_END_URL + PRODUCT_ENDPOINT + CREATE, product).subscribe(response => {
      this.triggerProductService.next();
      this.triggerNavigate.next();
    }, error => {
      this.triggerResponse.next(error.error);
    });
  }

  updateProduct(product) {
    this.http.put<ResponseMessage>(BACK_END_URL + PRODUCT_ENDPOINT + UPDATE, product).subscribe(response => {
      this.triggerProductService.next();
      this.triggerNavigate.next();
    }, error => {
      this.errorService.error = error.error;
      this.triggerResponse.next(error.error);
    });
  }

  getProductById(id: number) {
    this.http.get<Product>(BACK_END_URL + PRODUCT_ENDPOINT + "/" + id).subscribe(product => {
      this.triggerProductEntity.next(product);
    }, error => {
      this.errorService.error = error.error;
      this.triggerResponse.next(error.error);
    });
  }

  fetchAllGroup() {
    this.http.get<Group[]>(BACK_END_URL + GROUP_ENDPOINT + GET_ALL).subscribe(groups => {
      this.groupService.group = groups.sort((a, b) => a.groupLeader.visa.localeCompare(b.groupLeader.visa));
      this.triggerGroupService.next(groups);
    }, error => {
    });
  }

  getGroupById(id: number) {
    this.http.get<Project>(BACK_END_URL + PROJECT_ENDPOINT + "/" + id).subscribe(project => {
      this.triggerProjectEntity.next(project);
    }, error => {
      this.errorService.error = error.error;
      this.triggerResponse.next(error.error);
    });
  }

  updateProject(project) {
    this.http.put<ResponseMessage>(BACK_END_URL + PROJECT_ENDPOINT + UPDATE, project).subscribe(response => {

      this.triggerProjectService.next();
      this.triggerNavigate.next();
    }, error => {
      this.errorService.error = error.error;
      this.triggerResponse.next(error.error);
    });
  }

  fetchAllEmployee(){
    this.http.get<Employee[]>(BACK_END_URL + PROJECT_ENDPOINT + "/get-employee").subscribe(employees=>{
      this.employeeService.employees = employees;
      this.triggerEmployeeService.next();
    });
  }


}
