import {Injectable} from "@angular/core";

@Injectable()
export class ErrorService {
  private _error: string;

  get error(): string {
    return this._error;
  }

  set error(value: string) {
    this._error = value;
  }
}
