import { HttpClient } from '@angular/common/http';
import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { environment } from '@environments/environment';
import { ModalEditorComponent, ModalImageComponent, ModalKeyComponent } from '@home/components';
import { IImage } from '@home/models/image';
import { IKey } from '@home/models/key';
import { IKeyInfo, IPaginate } from '@home/models/metadata';
import { Alert } from '@shared/functions';
import { Subject } from 'rxjs';

interface ISearch {
  code?: string | string[];
  desc?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class KeysService {
  private view!: ViewContainerRef;
  private viewChange$: Subject<ViewContainerRef>;
  private modalImage?: ComponentRef<ModalImageComponent>;
  private modalEditor?: ComponentRef<ModalEditorComponent>;
  private modalKey?: ComponentRef<ModalKeyComponent>;
  public resetSatus: Subject<number>;
  public loading: boolean;
  private url: string;
  private info: IKeyInfo;
  private keys_array: IKey[];
  private metadata: IPaginate;
  private page: number;
  private params: ISearch;

  constructor(
    private http: HttpClient,
  ) {
    this.viewChange$ = new Subject();
    this.resetSatus = new Subject();
    this.url = environment.httpUrl;
    this.info = {
      status: {
        defective: 0,
        found: 0,
        photographed: 0,
        prepared: 0,
        edited: 0,
        saved: 0
      },
      success: 0
    };
    this.keys_array = new Array<IKey>();
    this.metadata = {
      totalDocs: 0,
      limit: 0,
      page: 1,
      nextPage: null,
      prevPage: null,
      hasNextPage: false,
      hasPrevPage: false,
      totalPages: 0
    };
    this.page = 0;
    this.loading = false;
    this.params = {};
    this.getView();
  }

  getView(): void {
    this.viewChange$.subscribe(view => {
      this.view = view;
    });
  }

  set container(view: ViewContainerRef) {
    this.viewChange$.next(view);
  }

  getKeys(params: { page?: number; code?: string | string[]; desc?: string; status?: string; }) {
    return this.http.get<{ data: IKey[]; metadata: IPaginate; }>(`${this.url}/key`, { params, withCredentials: false });
  }

  getKeysInfo(params: { code?: string | string[]; desc?: string; status?: string; }) {
    return this.http.get<{ data: IKeyInfo }>(`${this.url}/key/info`, { params, withCredentials: false });
  }

  getNextLast(code: string) {
    return this.http.get<{ data: IKey }>(`${this.url}/key/${code}/next`);
  }

  reset(): void {
    this.keys_array = new Array<IKey>();
    this.page = 0;
  }

  more(): void {
    ++this.page;
    this.loading = true;
    this.getKeys({ page: this.page, ...this.params }).subscribe({
      next: ({ data, metadata }) => {
        this.keys_array = this.keys_array.concat(data);
        this.metadata = metadata;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
      }
    });
  }

  showImages(key: IKey, idN?: number): void {
    if (!!this.view) {
      this.view.clear();
      this.modalImage = this.view.createComponent(ModalImageComponent);
      this.modalImage.instance.key = key;
      this.modalImage.changeDetectorRef.detectChanges();
      this.modalImage.instance.show(idN);
    }
  }

  edit(key: IKey) {
    if (!!this.view) {
      this.view.clear();
      this.modalKey = this.view.createComponent(ModalKeyComponent);
      this.modalKey.instance.key = key;
      this.modalKey.changeDetectorRef.detectChanges();
      this.modalKey.instance.show();
    }
  }

  editImage(key: IKey, image: IImage) {
    if (!!this.view) {
      this.view.clear();
      this.modalEditor = this.view.createComponent(ModalEditorComponent);
      this.modalEditor.instance.key = key;
      this.modalEditor.instance.image = image;
      this.modalEditor.changeDetectorRef.detectChanges();
      this.modalEditor.instance.show();
    }
  }

  set refresh(params: ISearch) {
    this.params = params;
    this.reset();
    this.more();
    this.getKeysInfo(params).subscribe(({ data }) => this.info = data);
  }

  get get() {
    return this.keys_array.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0));
  }

  get hasNextPage() {
    return this.metadata.hasNextPage;
  }

  get percentage() {
    if (this.info.success === 0) {
      return 0;
    }
    return 100 * this.info.success / this.metadata.totalDocs;
  }

  get total() {
    return this.metadata.totalDocs;
  }

  get isEmpty() {
    return this.keys_array.length === 0;
  }

  set prev(code: string) {
    if (this.keys_array.length > 1) {
      let index = this.keys_array.findIndex(k => k.code === code);
      if (index !== 0) {
        do {
          --index;
        } while (!this.keys_array[index]?.image?.some(i => i.status === 5) && index !== 0);

        if (!!this.modalImage) {
          this.modalImage.instance.key = this.keys_array[index];
        }
      } else {
        Alert.fire({
          title: 'No hay imagen anterior',
          text: 'Es la primera',
          icon: 'error',
        });
      }
    }
  }

  set next(code: string) {
    if (this.keys_array.length > 1) {
      let index = this.keys_array.findIndex(k => k.code === code);
      if (index !== this.keys_array.length - 1) {
        do {
          ++index;
        } while (!this.keys_array[index]?.image?.some(i => i.status === 5) && index < this.keys_array.length);

        if (!!this.modalImage) {
          this.modalImage.instance.key = this.keys_array[index];
        }
      } else {
        Alert.fire({
          title: 'No hay imagen siguiente',
          text: 'Consulta más',
          icon: 'error',
        });
      }
    }
  }

  async delete(_id: string) {
    const lastCode = this.keys_array[this.keys_array.length - 1].code;
    const last = await this.getNextLast(lastCode).toPromise().catch(() => null);
    if (last?.data) {
      this.keys_array.push(last.data);
    }

    const index = this.keys_array.findIndex(i => i._id === _id);
    let successDeleted = false;
    this.keys_array[index].image.forEach(({ status }) => {
      if (status === 5 && !successDeleted) {
        this.substractSuccess();
        successDeleted = true;
      }
      this.substractStatus = status;
    });
    --this.metadata.totalDocs;
    this.keys_array.splice(index, 1);
  }

  deleteImage(_id: string, image: IImage): void {
    const index = this.keys_array.findIndex(i => i._id === _id);
    const indexImage = this.keys_array[index].image.findIndex(i => i.idN === image.idN);
    if (this.keys_array[index].image.filter(i => i.status === 5).length === 1)
      this.substractSuccess();
    this.keys_array[index].image.splice(indexImage, 1);
    this.substractStatus = image.status;
    this.resetSatus.next(index);
  }

  set update(key: IKey) {
    const index = this.keys_array.findIndex(i => i._id === key._id);
    this.keys_array[index].code = <string>key.line?.identifier + <string>key.line?.supplier.identifier + key.code;
    this.keys_array[index].desc = key.desc;
  }

  updateImage(_id: string, image: IImage): void {
    const index = this.keys_array.findIndex(i => i._id === _id);
    const indexImage = this.keys_array[index].image.findIndex(i => i.idN === image.idN);
    this.keys_array[index].image[indexImage] = image;
  }

  resetImage(_id: string, status: number): void {
    const index = this.keys_array.findIndex(i => i._id === _id);
    let successMatch = false;
    this.keys_array[index].image.forEach(({ status }) => {
      if (status === 5 && !successMatch) {
        this.substractSuccess();
        successMatch = true;
      }
      this.substractStatus = status;
    });
    const new_image = new Array<IImage>();
    for (let idN = 0; idN < 3; idN++) {
      new_image.push({
        idN,
        status,
        public_id: null,
        url: null
      });
    }
    this.keys_array[index].image = new_image;
    this.resetSatus.next(index);
  }

  addSuccess() {
    ++this.info.success;
  }

  substractSuccess() {
    --this.info.success;
  }

  status(type: number | 0 | 1 | 2 | 3 | 4 | 5): number {
    const name = this.statusName(type);
    if (name) {
      return this.info.status[name];
    } else {
      return 0;
    }
  }

  statusName(status: number | 0 | 1 | 2 | 3 | 4 | 5) {
    switch (status) {
      case 0:
        return 'defective';
      case 1:
        return 'found';
      case 2:
        return 'photographed';
      case 3:
        return 'prepared';
      case 4:
        return 'edited';
      case 5:
        return 'saved';
      default:
        return null;
    }
  }

  set addStatus(type: number | 0 | 1 | 2 | 3 | 4 | 5) {
    const name = this.statusName(type);
    if (name)
      ++this.info.status[name];
  }

  set substractStatus(type: number | 0 | 1 | 2 | 3 | 4 | 5) {
    const name = this.statusName(type);
    if (name)
      --this.info.status[name];
  }

  replace(pre: string | '0' | '1' | '2' | '3' | '4' | '5', next: string | '0' | '1' | '2' | '3' | '4' | '5'): void {
    if (pre)
      this.substractStatus = +pre;
    if (next)
      this.addStatus = +next;
  }
}
