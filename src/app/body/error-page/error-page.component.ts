import {Component, OnInit} from '@angular/core';
import {DataStorageService} from "../../shared/data-storage.service";
import {ErrorService} from "../../services/error.service";

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  error;

  constructor(private dataStorageService: DataStorageService, private errorService: ErrorService) {
  }

  ngOnInit(): void {
    this.dataStorageService.triggerErrorPage.subscribe(response => {
      this.errorService = response;
    })
    this.error = this.errorService.error;
  }

  onBackToSearchProject() {
    this.dataStorageService.triggerBackToSearchProject.next();
  }
}
