import {Component, OnInit} from '@angular/core';
import {DataStorageService} from "../shared/data-storage.service";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  internalError;

  constructor(private dataStorageService: DataStorageService) {
  }

  ngOnInit(): void {
    this.dataStorageService.triggerBackToSearchProject.subscribe(() => {
      this.internalError = false;
    })
  }

}
