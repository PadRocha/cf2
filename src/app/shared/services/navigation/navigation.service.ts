import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previous: BehaviorSubject<string>;
  private current: BehaviorSubject<string>;

  constructor(
    private router: Router
  ) {
    this.previous = new BehaviorSubject<string>('');
    this.current = new BehaviorSubject<string>('');
    this.getRoute();
  }

  getRoute(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        // pairwise(),
      ).subscribe(event => {
        // console.log(prev, curr)
        // this.previous.next(prev as string);
      });
  }
}
