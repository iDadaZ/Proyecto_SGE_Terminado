import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  version = '1.0.0';

  yyyy: number;
  constructor() { }

  ngOnInit() {
    this.yyyy = new Date().getFullYear();
  }

}
