import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { UserService } from '@auth/services';
import { IImage } from '@home/models/image';
import { IKey } from '@home/models/key';
import { ExchangesService, KeysService } from '@home/services';
import { Alert } from '@shared/functions';
import { Modal } from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss'],
  host: {
    class: 'modal fade animate__animated animate__backInDown',
    tabindex: '-1'
  }
})
export class ModalImageComponent implements AfterViewInit, OnDestroy {
  current_image: number;
  private modal?: Modal;
  key: IKey;

  constructor(
    private element: ElementRef<HTMLElement>,
    private user: UserService,
    private exchanges: ExchangesService,
    private keys: KeysService,
  ) {
    this.current_image = 0;
    this.key = {
      _id: '',
      code: '',
      desc: '',
      image: new Array<IImage>(),
      createdAt: new Date,
      updatedAt: new Date,
    }
  }

  ngAfterViewInit(): void {
    this.modal = new Modal(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.hide();
  }

  @HostListener('keydown', ['$event'])
  keySetting({ key }: KeyboardEvent): void {
    if (this.element.nativeElement.classList.contains('show')) {
      if (key === 'ArrowUp') {
        this.keys.prev = this.key.code;
      } else if (key === 'ArrowDown') {
        this.keys.next = this.key.code;
      } else if (key === ' ') {
        this.configImage(this.images[this.current_image].idN);
      }

      if (this.images.length !== 1) {
        if (key === 'ArrowRight') {
          this.nextImage();
        } else if (key === 'ArrowLeft') {
          this.prevImage();
        }
      }
    }
  }

  @HostListener('hidden.bs.modal')
  reset(): void {
    this.current_image = 0;
  }

  get images(): IImage[] {
    return this.key.image
      .sort((a, b) => a.idN - b.idN)
      .filter(({ url }) => url);
  }

  show(idN?: number): void {
    if (idN)
      this.current_image = this.images.findIndex(i => i.idN === idN);

    this.modal?.show();
  }

  hide(): void {
    this.modal?.hide();
  }

  prevImage(): void {
    this.current_image = this.current_image === 0 ? this.images.length - 1 : this.current_image - 1;
  }

  nextImage(): void {
    this.current_image += 1;
    this.current_image %= this.images.length;
  }

  currentImage(i: number): boolean {
    return this.current_image === i;
  }

  configImage(idN: number): void {
    if (this.user.hasRole(['EDIT', 'GRANT', 'ADMIN'])) {
      this.hide();
      Swal.fire({
        title: `${this.key.code} ~ [${idN + 1}]`,
        showDenyButton: true,
        showConfirmButton: this.user.hasRole(['GRANT', 'ADMIN']),
        denyButtonText: `Editar Imagen`,
        confirmButtonText: `Eliminar Imagen`,
        denyButtonAriaLabel: `Editar imagen ${this.key.code} ~ [${idN + 1}]`,
        confirmButtonAriaLabel: `Eliminar imagen ${this.key.code} ~ [${idN + 1}]`,
        denyButtonColor: 'rgb(62, 15, 116)',
        confirmButtonColor: 'rgb(105, 8, 8)',
        keydownListenerCapture: true,
      }).then(({ isConfirmed, isDenied }) => {
        if (isConfirmed) {
          Swal.fire({
            title: '¿Estás absolutamente seguro?',
            input: 'text',
            html: `Por favor escriba <b>${this.key.code}_${idN}</b> para confirmar.`,
            inputAutoTrim: true,
            inputValidator: value => {
              return value !== `${this.key.code}_${idN}` ? 'Confirma correctamente' : null;
            },
            showConfirmButton: true,
            confirmButtonText: 'Entiendo las consecuencias, eliminar imagen',
            confirmButtonAriaLabel: `Eliminar imagen ${this.key.code} ~ [${idN + 1}]`,
            confirmButtonColor: 'rgb(105, 8, 8)',
            showLoaderOnConfirm: true,
            preConfirm: () => {
              return this.exchanges
                .deleteImage(this.key._id, idN)
                .toPromise()
                .catch(() => {
                  Alert.fire({
                    title: 'Error Imagen',
                    text: `${this.key.code} ~ [${idN + 1}] image`,
                    icon: 'error',
                  });
                });
            },
            keydownListenerCapture: true
          }).then(({ isConfirmed }) => {
            if (isConfirmed) {
              Alert.fire({
                title: 'Imagen Eliminada',
                text: `${this.key.code} ~ [${idN + 1}] image`,
                icon: 'success',
              });
              this.keys.deleteImage(this.key._id, <IImage>this.images.find(i => i.idN === idN));
              if (this.images.length > 0) {
                this.show();
              }
            } else {
              this.current_image = this.images.findIndex(i => i.idN === idN);
              this.show();
            }
          });
        } else if (isDenied) {
          this.hide();
          this.keys.editImage(this.key, <IImage>this.images.find(i => i.idN === idN));
        } else {
          this.current_image = this.images.findIndex(i => i.idN === idN);
          this.show();
        }
      });
    }

  }
}
