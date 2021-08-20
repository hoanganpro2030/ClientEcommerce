import {Component, OnInit} from '@angular/core';
import {DataStorageService} from "./shared/data-storage.service";
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pimtool';

  constructor(private dataStorageService: DataStorageService, translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.dataStorageService.fetchAllProjects(0);
  }

  onFetchProject() {

  }
}
