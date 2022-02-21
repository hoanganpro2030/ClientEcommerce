import { Injectable } from '@angular/core';
import { Address } from '../model/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private _addresses: Address[] = []

  get addresses(): Address[] {
    return this._addresses;
  }

  set addresses(value: Address[]) {
    this._addresses = value;
  }

  deleteAddreses(id: number) {
    let index = this._addresses.findIndex(p => p.id === id);
    this._addresses.splice(index, 1);
  }

  findAddressById(id: number): Address {
    return this._addresses.find((a) => a.id === id);
  }

  insertAddress(address: Address) {
    this._addresses.push(address);
  }

  constructor() { }
}
