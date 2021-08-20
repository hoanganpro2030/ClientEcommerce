import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public selecting = 'list';

  constructor() {
  }

  ngOnInit(): void {
  }

  onClickList() {
    this.selecting = 'list';
  }

  onClickForm() {
    this.selecting = 'form';
  }
}
