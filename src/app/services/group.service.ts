import {Group} from "../model/group.model";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class GroupService {
  private _group: Group[] = [];


  get group(): Group[] {
    return this._group;
  }

  set group(value: Group[]) {
    this._group = value;
  }

}
