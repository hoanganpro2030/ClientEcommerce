import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ResponseMessage} from '../../../model/response.message';
import {STATUS_CODE} from '../../../shared/status-code';
import {Group} from '../../../model/group.model';
import {Project, Status} from '../../../model/project.model';
import {Employee} from '../../../model/employee.model';
import {ProjectService} from '../../../services/project.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {GroupService} from '../../../services/group.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../../../services/employee.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent implements OnInit {

  projectForm = new FormGroup({
    projectNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.max(9999)]),
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    customer: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    group: new FormControl("-1", [Validators.required, Validators.pattern("^[0-9]*$")]),
    employees: new FormControl(''),
    status: new FormControl('NEW', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl(''),
  })
  public hasError = false;
  public errorClient = false;
  public respone: ResponseMessage;
  public statusCode = STATUS_CODE;
  public groups: Group[];
  public ps = Status;
  public projectId = null;
  public projects: Project[];
  public project: Project;
  public isSubmit = false;
  public employees: Employee[];
  public typing: boolean =false;
  public typedEmp: Employee[]=[];
  constructor(private projectService: ProjectService,
              private dataStorageService: DataStorageService,
              private groupService: GroupService,
              private route: ActivatedRoute,
              private router: Router,
              private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.dataStorageService.triggerNavigate.subscribe(response => {
      this.router.navigate(['/project-list']);
      this.dataStorageService.fetchAllProjects(0);
    })

    this.dataStorageService.triggerResponse.subscribe(response => {
      if (response.statusCode === STATUS_CODE.PCONCUR_UPD.code || response.statusCode === STATUS_CODE.PNOT_FOUND.code) {
        this.router.navigate(['error']).then(() => {
          this.dataStorageService.triggerErrorPage.next(response);
        })
      }
      this.respone = response;
      this.hasError = true;
    })

    this.dataStorageService.triggerProjectService.subscribe(next => {
      this.projects = this.projectService.projects;
    })
    this.projects = this.projectService.projects;

    this.dataStorageService.triggerGroupService.subscribe(groups => {
      this.groups = this.groupService.group;
    })
    this.dataStorageService.triggerEmployeeService.subscribe(()=>{
      this.employees = this.employeeService.employees;
    })
    this.dataStorageService.fetchAllGroup();
    this.dataStorageService.fetchAllEmployee();
    this.groups = this.groupService.group;

    this.dataStorageService.triggerProjectEntity.subscribe(project => {
      this.project = project;
      if (this.projectId) {
        this.initDataToForm();
        this.typedEmp = this.project.employees;
        this.employees = this.employees.filter(e=>!this.typedEmp.find(typed=>typed.visa===e.visa));
      }
    })
    this.projectId = this.route.snapshot.params['id'];
    if (this.projectId) {
      this.dataStorageService.getGroupById(this.projectId);
      this.projectForm.controls.projectNumber.disable();
    }


  }

  initDataToForm() {
    this.projectForm.patchValue({
      projectNumber: this.project.projectNumber,
      name: this.project.name,
      customer: this.project.customer,
      group: this.project.group.id,
      employees: this.project.employees.map(e => e.visa).join(","),
      status: this.project.status,
      startDate: this.project.startDate,
      endDate: this.project.endDate,
    })
  }

  onSubmit() {
    this.isSubmit = true;

    this.projectForm.controls.projectNumber.enable();
    let projectRaw = this.projectForm.value;
    if (this.projectId) {
      this.projectForm.controls.projectNumber.disable();
    }

    let employees: Employee[] = [];
    if (this.typedEmp) {
      for (let emp of this.typedEmp) {
        let e: Employee = {
          id: null,
          visa: emp.visa,
          firstName: null,
          lastName: null,
          birthDay: null,
          version: null,
        };
        employees.push(e);
      }
    }
    projectRaw.employees = employees;

    if (projectRaw.group) {
      projectRaw.group = this.groups.find(g => g.id == projectRaw.group);
    }

    let project: Project = projectRaw;
    if (this.projectForm.valid) {
      if (this.projectId) {
        project.id = this.projectId;
        project.version = this.project.version;
        this.dataStorageService.updateProject(project);
      } else {
        this.dataStorageService.createNewProject(project);
      }
    } else {
      this.errorClient = true;
    }
  }

  onSelectEmp(visa: string, fn: string, ln:string){
    this.projectForm.value.employees + ',' + visa;
    this.typedEmp.push({
      id: null,
      visa: visa,
      firstName: fn,
      lastName: ln,
      birthDay: null,
      version: null
    })
    let index = this.employees.findIndex(p => p.visa === visa);
    this.employees.splice(index, 1);
  }

  onRemoveEmpTyped(visa: string, fn: string, ln:string){
    let index = this.typedEmp.findIndex(p => p.visa === visa);
    this.typedEmp.splice(index, 1);
    this.employees.push({
      id: null,
      visa: visa,
      firstName: fn,
      lastName: ln,
      birthDay: null,
      version: null
    })
  }

}
