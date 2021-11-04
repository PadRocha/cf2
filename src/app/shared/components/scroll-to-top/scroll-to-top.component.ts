import { Component, HostBinding, HostListener } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'scroll-to-top',
  template: '',
  styleUrls: ['./scroll-to-top.component.scss'],
})
export class ScrollToTopComponent {
  private toogle_ratio: number;
  @HostBinding('class.showBtn') showBtn: boolean;

  constructor(
    private scroller: ViewportScroller,
  ) {
    this.toogle_ratio = 0.50;
    this.showBtn = false;
  }

  @HostListener('window:scroll', ['$event']) onScroll({ target }: Event): void {
    const document = (target as Document).documentElement;
    const scrollTotal = document.scrollHeight - document.clientHeight;
    this.showBtn = (document.scrollTop / scrollTotal) > this.toogle_ratio ?? false;
  }

  @HostListener('click') onClick(): void {
    this.scroller.scrollToPosition([0, 0]);
  }
}
