import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { error } from 'protractor';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Address } from 'src/app/model/address.model';
import { User } from 'src/app/model/user.model';
import { AddressService } from 'src/app/services/address.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { threadId } from 'worker_threads';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userInfo: User;
  addresses: Address[]
  showLoadingSaveProfile = false;
  showLoadingSaveAddress = false;
  @ViewChild('newAddressExpansion') newAddressExpansion : ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  panelOpenState = false
  addressForms: FormGroup[] = [];
  infoForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  newAddressForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'),
        Validators.maxLength(10), Validators.minLength(7)]),
    province: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    district: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    ward: new FormControl('', [Validators.required, Validators.maxLength(50)]),
    street: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    note: new FormControl(''),
    isDefault: new FormControl(false)
  })
  constructor(private authenticationService: AuthenticationService, 
              private notificationService: NotificationService,
              private dataStorageService: DataStorageService,
              private addressService: AddressService) { }

  ngOnInit(): void {
    this.authenticationService.getUser(this.authenticationService.getUserFromLocalCache().id).subscribe(user => {
      this.userInfo = user;
      this.infoForm = new FormGroup({
        fullName: new FormControl(user.fullName, [Validators.required, Validators.maxLength(50)]),
        email: new FormControl(user.email, [Validators.required, Validators.email]),
      });
      this.dataStorageService.getAddressesFromUser(this.userInfo.id);
    }, error => {
      this.notificationService.notify(NotificationType.ERROR, error.error.message)
    })

    this.dataStorageService.triggerAddressService.subscribe(addresses => {
      this.addresses = addresses;
      let addressForm: FormGroup;
      this.addressForms = [];
      this.addresses.forEach((address) => {
        addressForm = new FormGroup({
          id: new FormControl(address.id),
          title: new FormControl(address.title, [Validators.required, Validators.maxLength(50)]),
          phoneNumber: new FormControl(address.phoneNumber, [Validators.required, Validators.pattern('^[0-9]*$'),
              Validators.maxLength(10), Validators.minLength(7)]),
          province: new FormControl(address.province, [Validators.required, Validators.maxLength(50)]),
          district: new FormControl(address.district, [Validators.required, Validators.maxLength(50)]),
          ward: new FormControl(address.ward, [Validators.required, Validators.maxLength(50)]),
          street: new FormControl(address.street, [Validators.required, Validators.maxLength(255)]),
          note: new FormControl(address.note),
          isDefault: new FormControl(address.isDefault)
        })
        this.addressForms.push(addressForm);
      })
      this.showLoadingSaveAddress = false;
      this.newAddressForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'),
            Validators.maxLength(10), Validators.minLength(7)]),
        province: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        district: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        ward: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        street: new FormControl('', [Validators.required, Validators.maxLength(255)]),
        note: new FormControl(''),
        isDefault: new FormControl(false)
      })
      
    }, error => {
      this.showLoadingSaveAddress = false;
      this.notificationService.notify(NotificationType.ERROR, error.error.message)
    })
    
  }

  onSaveProfile(): void {
    if (this.infoForm.valid) {
      this.showLoadingSaveProfile = true;
      let user = {
        "fullName": this.infoForm.value.fullName,
        "id": this.userInfo.id
      }
      this.authenticationService.updateUser(user).subscribe(user => {
        this.userInfo = user;
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(user));
        this.infoForm = new FormGroup({
          fullName: new FormControl(this.userInfo.fullName, [Validators.required, Validators.maxLength(50)]),
          email: new FormControl(this.userInfo.email, [Validators.required, Validators.email]),
        });
        this.showLoadingSaveProfile = false;
      }, error => {
        this.notificationService.notify(NotificationType.ERROR, error.error.message)
        this.showLoadingSaveProfile = false;
      });
    }
  }

  onUpdateAddress(addressForm: FormGroup): void {
    if (addressForm.valid) {
      let addressUpdate: Address = addressForm.value;
      this.showLoadingSaveAddress = true;
      this.dataStorageService.updateAddress(addressUpdate);
    }
  }

  onAddNewAddress(): void {
    if (this.newAddressForm.valid) {
      let addressNew: Address = this.newAddressForm.value;
      this.showLoadingSaveAddress = true;
      this.dataStorageService.createNewAddress(addressNew);
      this.accordion.closeAll();
      // let el: HTMLElement = this.newAddressExpansion.nativeElement as HTMLElement;
      // el.click();
    }
  }

  onDeleteAddress(addressId: number): void {
    this.dataStorageService.deleteAddress(addressId);
  }

}
