import {Employee} from "./employee.model";
import {Group} from "./group.model";

export enum Status {
  NEW = "New",
  PLA = "planned",
  INP = "in progress",
  FIN = "finished"
}

export const PROJECT_STATUS = {
  "NEW": "New",
  "PLA": "Planned",
  "INP": "In progress",
  "FIN": "Finished"
}

export interface Project {
  id: number;
  group: Group;
  projectNumber: number;
  name: string;
  customer: string;
  employees: Employee[];
  status: Status;
  startDate: string;
  endDate: string;
  ischeck: boolean;
  version: number;
}
