import {Injectable} from "@angular/core";
import {Employee} from "../model/employee.model";

@Injectable()
export class EmployeeService {
  private _employees: Employee[] =[];

  get employees(): Employee[] {
    return this._employees;
  }

  set employees(value: Employee[]) {
    this._employees = value;
  }
}
