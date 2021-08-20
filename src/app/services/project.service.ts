import {Project} from "../model/project.model";
import {Injectable} from "@angular/core";

@Injectable()
export class ProjectService {
  private _projects: Project[] = [];

  get projects(): Project[] {
    return this._projects;
  }

  set projects(value: Project[]) {
    this._projects = value;
  }


  deleteProjects(id: number) {
    let index = this._projects.findIndex(p => p.id === id);
    this._projects.splice(index, 1);
  }

  findProjectById(id: number): Project {
    return this._projects.find((p) => p.id === id);
  }

  insertProject(project: Project) {
    this.projects.push(project);
  }
}
