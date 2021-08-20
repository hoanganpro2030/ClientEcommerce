import {Project} from "./project.model";

export interface PaginateModel {
  current: number;
  total: number;
  size: number;
  data: Project[];
}
