import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  language = 'en';

  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
  }

  onChangeEn() {
    this.translate.use('en');
    this.language = 'en';
  }

  onChangeFr() {
    this.translate.use('fr');
    this.language = 'fr';
  }
}
