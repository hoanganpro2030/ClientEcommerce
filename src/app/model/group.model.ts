import {Employee} from "./employee.model";

export interface Group {
  id: number;
  groupLeader: Employee;
  version: number;
}
