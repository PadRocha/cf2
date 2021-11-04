import { Component, Input, OnChanges } from '@angular/core';
import { DataPaginated } from '../../models/interfaces';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  host: { class: 'd-flex justify-content-center mt-4' },
})
export class PaginationComponent implements OnChanges {
  paginate: number[];
  @Input() metadata: DataPaginated<any>;
  @Input() route: string[];
  @Input() limit: number;
  @Input() handling: 'merge' | 'preserve' | '';

  constructor() {
    this.paginate = new Array<number>();
    this.metadata = {
      totalDocs: 0,
      limit: 0,
      page: 0,
      nextPage: null,
      prevPage: null,
      hasNextPage: false,
      hasPrevPage: false,
      totalPages: 0,
    }
    this.route = new Array('/');
    this.limit = 5;
    this.handling = '';
  }

  ngOnChanges(): void {
    this.paginate = this.paginateCalc();
  }

  private paginateCalc(): number[] {
    const array = new Array<number>();
    if (this.metadata.page < this.limit && this.metadata.totalPages > this.limit) {
      for (let i = 0; i < this.limit + 1; i++) {
        array.push(i);
      }
      return array;
    }
    array.push(this.metadata.page);
    for (let i = 1; i < (this.limit / 2) + 1; i++) {
      const next = this.metadata.page + i;
      const previous = this.metadata.page - i;
      if (next < this.metadata.totalPages + 1) array.push(next);
      if (previous > 0) array.push(previous);
    }
    return array.sort((a, b) => a - b);
  }
}
