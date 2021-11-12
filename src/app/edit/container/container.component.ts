import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  host: {
    class: 'd-block container my-3'
  }
})
export class ContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
