import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CloudinaryImage } from '@cloudinary/base';
import { Resize } from '@cloudinary/base/actions/resize';
import { environment } from '@environments/environment';
import { IImage } from '@home/models/image';
import { IKey } from '@home/models/key';
import { ExchangesService, KeysService } from '@home/services';
import { Alert } from '@shared/utils';
import { Modal } from 'bootstrap';

@Component({
  selector: 'modal-key',
  templateUrl: './modal-key.component.html',
  styleUrls: ['./modal-key.component.scss'],
  host: {
    class: 'modal fade animate__animated animate__backInDown',
    tabindex: '-1'
  },
})
export class ModalKeyComponent implements AfterViewInit, OnDestroy {
  key: IKey;
  keyUpdate: FormGroup;
  resetImage: FormControl;
  isLoading: boolean;
  private cloudinary: string;
  private modal?: Modal;

  constructor(
    private element: ElementRef,
    private keys: KeysService,
    private exchanges: ExchangesService,
  ) {
    this.key = {
      _id: '',
      code: '',
      desc: '',
      image: new Array(),
      createdAt: new Date,
      updatedAt: new Date,
    }
    this.keyUpdate = new FormGroup({
      line: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      code: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
      desc: new FormControl('', [Validators.required])
    });
    this.resetImage = new FormControl('', [Validators.required]);
    this.isLoading = false;
    this.cloudinary = environment.cloudinary;
  }

  ngAfterViewInit(): void {
    this.modal = new Modal(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.hide();
  }

  get images(): IImage[] {
    return this.key.image
      .sort((a, b) => a.idN - b.idN)
      .filter(({ url }) => url);
  }

  get lineValidator(): boolean {
    return this.keyUpdate.get('line')?.invalid ?? false;
  }

  get codeValidator(): boolean {
    return this.keyUpdate.get('code')?.invalid ?? false;
  }

  get descValidator(): boolean {
    return this.keyUpdate.get('desc')?.invalid ?? false;
  }

  private setKey(): void {
    this.keyUpdate.get('line')?.setValue(this.key.code.slice(0, 6));
    this.keyUpdate.get('code')?.setValue(this.key.code.slice(6, 10));
    this.keyUpdate.get('desc')?.setValue(this.key.desc);
  }

  show(): void {
    this.modal?.show();
    this.setKey();
  }

  hide(): void {
    this.modal?.hide();
  }

  transform(image: IImage) {
    return new CloudinaryImage(<string>image.public_id, { cloudName: this.cloudinary })
      .resize(Resize.scale().width(119))
      .toURL();
  }

  statusClass(): string {
    return this.resetImage.value ? `idN${this.resetImage.value}` : '';
  }

  onSubmit(): void {
    if (this.keyUpdate.valid && !this.isLoading) {
      this.isLoading = true;
      this.exchanges.updateKey(this.key._id, this.keyUpdate.getRawValue() as IKey).subscribe({
        next: ({ data }) => {
          this.keys.update = data;
          this.hide();
          this.isLoading = false;
          Alert.fire({
            title: 'Clave Actualizada',
            text: this.key.code,
            icon: 'success',
          });
        },
        error: () => {
          this.isLoading = false;
          Alert.fire({
            title: 'Error Actualización',
            text: this.key.code,
            icon: 'error',
          });
        }
      });
    }
  }

  onReset(): void {
    if (!this.isLoading) {
      this.isLoading = true;
      const type = this.resetImage.value;
      const body = type ? { status: +type } : {};
      this.exchanges.resetKey(this.key._id, body).subscribe({
        next: ({ data }) => {
          this.keys.resetImage(this.key._id, type);
          this.hide();
          this.isLoading = false;
          Alert.fire({
            title: 'Imagenes Reseteadas',
            text: this.key.code,
            icon: 'success',
          });
        },
        error: () => {
          this.isLoading = false;
          Alert.fire({
            title: 'Error Actualización',
            text: this.key.code,
            icon: 'error',
          });
        }
      });
    }
  }
}
