import {Injectable} from "@angular/core";

@Injectable()
export class SearchService {
  private _text: string = '';

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  private _status: string = '-1';

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }
}
