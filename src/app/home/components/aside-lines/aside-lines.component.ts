import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ILine } from '@home/models/line';
import { ArrivalsService } from '@home/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'aside-lines',
  templateUrl: './aside-lines.component.html',
  styleUrls: ['./aside-lines.component.scss']
})
export class AsideLinesComponent implements OnInit {
  lines: ILine[];
  lineIsLoading: boolean;
  lineTotalDocs: number;
  regex: FormControl;
  private lineHasNextPage: boolean;
  private params: { page: number; identifier?: string; name?: string };
  @HostBinding('class.hide_aside') showSlide: boolean;
  @Output() selected: EventEmitter<string | null>;

  constructor(
    private arrivals: ArrivalsService,
  ) {
    this.lines = new Array<ILine>();
    this.lineIsLoading = false;
    this.lineHasNextPage = false;
    this.lineTotalDocs = 0;
    this.regex = new FormControl('', [Validators.required]);
    this.params = {
      page: 1
    };
    this.showSlide = false;
    this.selected = new EventEmitter();
  }

  ngOnInit(): void {
    this.getLines();
    this.viewRegex();
  }

  private getLines(): void {
    this.lineIsLoading = true;
    this.arrivals.getLines(this.params).subscribe(({ data, metadata }) => {
      this.lines = this.lines.concat(data);
      this.lineHasNextPage = metadata.hasNextPage;
      this.lineTotalDocs = metadata.totalDocs;
      this.lineIsLoading = false;
    }, err => {
      this.lineIsLoading = false;
    });
  }

  private isIdentifier(code: string) {
    return code.length > 0 && code.length < 7 && code.split('').every(c => c === c.toUpperCase());
  }

  private viewRegex(): void {
    this.regex.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        delete this.params.identifier;
        delete this.params.name;
        this.params.page = 1;

        if (this.regex.valid) {
          if (this.isIdentifier(value)) {
            this.params.identifier = value.trim();
          } else {
            this.params.name = value.trim();
          }
        }
        this.lines = new Array<ILine>();
        this.getLines();
      });
  }

  onScroll({ target }: Event) {
    const div = target as HTMLElement;
    const scrollTotal = div.scrollHeight - div.clientHeight;
    if ((div.scrollTop / scrollTotal) > 0.90 && !this.lineIsLoading && this.lineHasNextPage) {
      ++this.params.page;
      this.getLines();
    }
  }

  onAll() {
    this.selected.emit(null);
  }

  onSelected(identifier: string) {
    this.selected.emit(identifier);
  }

  toogleSlide(): void {
    this.showSlide = !this.showSlide;
  }
}
