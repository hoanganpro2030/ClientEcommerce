import {Injectable} from "@angular/core";
import {PaginateModel} from "../model/paginate.model";

@Injectable()
export class PaginateService {
  private _data: PaginateModel;

  get data(): PaginateModel {
    return this._data;
  }

  set data(value: PaginateModel) {
    this._data = value;
  }

}
