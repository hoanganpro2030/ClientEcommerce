import {Component, OnInit} from '@angular/core';
import {DataStorageService} from "../../../shared/data-storage.service";
import {Project, Status} from "../../../model/project.model";
import {ProjectService} from "../../../services/project.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ResponseMessage} from "../../../model/response.message";
import {SearchService} from "../../../services/search.service";
import {PaginateService} from "../../../services/paginate.service";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  searchFrom = new FormGroup({
    searchText: new FormControl(this.searchService.text),
    searchStatus: new FormControl(this.searchService.status)
  })
  public projects: Project[];
  public ps = Status;
  public response: ResponseMessage;
  public error = false;
  public totalPage;
  public currentPage;
  public countCheck;

  constructor(private dataStorageService: DataStorageService,
              private projectService: ProjectService,
              private searchService: SearchService,
              private paginateService: PaginateService) {
  }

  ngOnInit(): void {
    this.dataStorageService.triggerPagination.subscribe(rp=>{
      this.totalPage = this.paginateService.data.total;
      this.currentPage = this.paginateService.data.current;
    })

    this.projects = this.projectService.projects;

    if(this.paginateService.data){
      this.totalPage = this.paginateService.data.total;
      this.currentPage = this.paginateService.data.current;
    }

    this.dataStorageService.triggerProjectService.subscribe(next => {
      this.projects = this.projectService.projects;
    })

    this.dataStorageService.triggerResponse.subscribe(response => {
      this.response = response;
      this.error = true;
    })
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

  onDelete(id: number) {
    this.dataStorageService.deleteProjects(id);
  }

  onDeleteMany() {
    let ids = this.projects.filter(p => p.ischeck).map(p => p.id);
    this.dataStorageService.deleteMultiProject(ids);
    this.countCheck = 0;
  }

  onChangeCheckBox() {
    let ids = this.projects.filter(p => p.ischeck).map(p => p.id);
    this.countCheck = ids.length;
  }

  onResetSearch() {
    this.dataStorageService.fetchAllProjects(0);
    this.searchService.text = '';
    this.searchService.status = '-1';
  }

  onChangePage(page: number){
    if(this.searchService.status && this.searchService.status!='-1' || this.searchService.text) {
      this.dataStorageService.searchProjects(this.searchService.text, this.searchService.status, page);
    }
    else{
      this.dataStorageService.fetchAllProjects(page);
    }

  }

  onBackPage(){
    if(this.currentPage == 0){
      return;
    }
    if(this.searchService.status && this.searchService.status!='-1' || this.searchService.text) {
      this.dataStorageService.searchProjects(this.searchService.text, this.searchService.status, this.currentPage-1)
    }
    else{
      this.dataStorageService.fetchAllProjects(this.currentPage-1)
    }

  }

  onNextPage(){
    if(this.currentPage == this.totalPage-1){
      return;
    }
    if(this.searchService.status && this.searchService.status!='-1' || this.searchService.text) {
      this.dataStorageService.searchProjects(this.searchService.text, this.searchService.status, this.currentPage+1)
    }
    else{
      this.dataStorageService.fetchAllProjects(this.currentPage+1)
    }

  }
}
