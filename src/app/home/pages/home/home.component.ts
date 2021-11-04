import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KeyComponent } from '@home/components';
import { KeysService } from '@home/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  search: FormControl;
  status_list: number[];
  current_status: number | null;
  private params: { code?: string | string[]; desc?: string; status?: string; };
  private command_list: string[];
  @ViewChildren(KeyComponent) keysComponents!: QueryList<KeyComponent>;
  @ViewChild('menu_container', { read: ViewContainerRef }) menu_container!: ViewContainerRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public keys: KeysService,
  ) {
    this.search = new FormControl('', [Validators.required]);
    this.status_list = new Array(0, 1, 2, 3, 4, 5);
    this.current_status = null;
    this.params = {};
    this.command_list = new Array('code', 'desc', 'status');
  }

  ngOnInit(): void {
    this.setParams();
    this.statusEvent();
    this.configSearch();
  }

  ngAfterViewInit(): void {
    this.keys.container = this.menu_container;
  }

  private setParams(): void {
    this.route.queryParamMap.subscribe((params) => {
      let form_content = '';
      if (params.has('code')) {
        this.params.code = <string>params.get('code');
        form_content += `code: ${this.params.code};`;
      }
      if (params.has('desc')) {
        this.params.desc = <string>params.get('desc');
        form_content += `desc: ${this.params.desc};`;
      }
      if (params.has('status')) {
        this.params.status = <string>params.get('status');
        this.current_status = +this.params.status;
      }

      this.search.setValue(form_content, { emitEvent: false })
      this.keys.refresh = this.params;
    });
  }

  private statusEvent(): void {
    this.keys.resetSatus.subscribe(index => {
      const component = this.keysComponents.toArray().find((v, i) => i === index);
      component?.updateStatus();
    });
  }

  private isCode(code: string) {
    return code.length > 0 && code.length < 11 && code.split('').every(c => c === c.toUpperCase());
  }

  private resetParams() {
    delete this.params.code;
    delete this.params.desc;
    delete this.params.status;
    this.current_status = null;
  }

  private configSearch() {
    this.search.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.resetParams();
        if (this.search.valid) {
          const commands = value.split(';') as string[];
          commands.forEach(command => {
            if (this.command_list.some(c => command.includes(`${c}:`))) {
              const rule = command.split(':') as string[];
              const param = rule.shift();
              const val = rule.pop()?.trim();
              if (val) {
                switch (param) {
                  case 'code':
                    this.params.code = val.trim();
                    break;
                  case 'desc':
                    this.params.desc = val.trim();
                    break;

                  default:
                    break;
                }
              }
            } else if (this.isCode(command)) {
              this.params.code = command.trim();
            } else if (command.trim()) {
              this.params.desc = command.trim();
            }
          });
        }
        this.router.navigate(['/home'], { queryParams: this.params });
      });
  }

  onLineSelected(line: string | null) {
    if (line) {
      this.search.setValue(`code: ${line}`);
    } else {
      this.search.reset('');
    }
  }

  onScroll({ target }: Event) {
    const div = target as HTMLElement;
    const scrollTotal = div.scrollHeight - div.clientHeight;
    if ((div.scrollTop / scrollTotal) > 0.90 && !this.keys.loading && this.keys.hasNextPage) {
      this.keys.more();
    }
  }

  statusIcon(status: number) {
    return `assets/icons/${this.keys.statusName(status)}.svg`;
  }

  statUsChange(type: number) {
    if (this.keys.status(type) > 0) {
      if (this.current_status !== type) {
        this.current_status = type;
        this.params.status = type.toString();
      } else {
        this.current_status = null;
        delete this.params.status;
      }

      this.router.navigate(['/home'], { queryParams: this.params });
    }
  }
}
