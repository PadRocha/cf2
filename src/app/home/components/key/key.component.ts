import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '@auth/services';
import { IImage } from '@home/models/image';
import { IKey } from '@home/models/key';
import { ExchangesService, KeysService, ShippingsService } from '@home/services';
import { Alert } from '@shared/utils';
import { debounceTime, pairwise, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss'],
  host: { class: 'd-flex flex-column flex-lg-row border-bottom border-dark' }
})
export class KeyComponent implements OnInit {
  status_selects: FormControl[];
  @Input() key!: IKey;

  constructor(
    private user: UserService,
    private keys: KeysService,
    private exchanges: ExchangesService,
    private shippings: ShippingsService,
  ) {
    this.status_selects = new Array(new FormControl(''), new FormControl(''), new FormControl(''));
  }

  ngOnInit(): void {
    this.formsConfig();
  }

  formsConfig(): void {
    this.updateStatus();
    this.status_selects.forEach((form, idN) => {
      const status = this.key.image.find(i => i.idN === idN)?.status;
      form.valueChanges
        .pipe(debounceTime(500), startWith(status ?? ''), pairwise())
        .subscribe(async ([prev, next]: [string, string]) => {
          if (next === '5') {
            if (prev === '')
              return form.setValue(prev, { emitEvent: false });
            else if (prev === '5' && next === '5')
              return form.setValue('', { emitEvent: false });

            const { value: file } = await Swal.fire({
              title: 'Select image',
              input: 'file',
              inputAttributes: {
                'accept': 'image/*',
                'aria-label': 'Upload your profile picture'
              }
            }).then(result => {
              if (result.isDismissed || result.isDenied)
                form.setValue(prev);

              return result;
            });

            if (file) {
              const reader = new FileReader();
              reader.onload = ({ target }) => {
                Swal.fire({
                  title: '¿Seguro de querer subir imagen?',
                  imageUrl: <string>target?.result,
                  imageAlt: 'Imagen pendiente',
                  showConfirmButton: true,
                  confirmButtonText: 'Subir',
                  focusConfirm: true,
                  showLoaderOnConfirm: true,
                  preConfirm: () => {
                    const formData = new FormData();
                    formData.append('image', file, file.name);
                    return this.shippings
                      .sendImage(this.key._id, idN, formData)
                      .toPromise()
                      .catch(() => {
                        form.setValue(prev);
                        form.enable({ emitEvent: false });
                        Alert.fire({
                          title: 'Error Imagen',
                          text: `${this.key.code} ~ [${idN + 1}] image`,
                          icon: 'error',
                        });
                      });
                  }
                }).then(({ isConfirmed, value }) => {
                  if (isConfirmed && value) {
                    this.keys.replace(prev, next);
                    if (this.key.image.filter(i => i.status === 5).length === 0)
                      this.keys.addSuccess();
                    this.key.image = value.data.image;
                    form.disable({ emitEvent: false });
                    Alert.fire({
                      title: 'Imagen Actualizada',
                      text: `${this.key.code} ~ [${idN + 1}] image`,
                      icon: 'success',
                    });
                  } else {
                    form.setValue(prev);
                  }
                });
              }
              reader.readAsDataURL(file)
            } else {
              form.setValue(prev);
            }
          } else if (prev !== '5' && next !== '5') {
            const body = next ? { status: +next } : {};
            form.disable({ emitEvent: false });
            this.exchanges.updateStatus(this.key._id, idN, body).subscribe({
              next: ({ data }) => {
                this.key.image = data.image;
                this.keys.replace(prev, next);
                form.enable({ emitEvent: false });
                Alert.fire({
                  title: 'Actualizado',
                  text: `${this.key.code} ~ [${idN + 1}] status`,
                  icon: 'success',
                });
              },
              error: () => {
                form.setValue(prev);
                form.enable({ emitEvent: false });
                Alert.fire({
                  title: 'Error Actualización',
                  text: `${this.key.code} ~ [${idN + 1}] status`,
                  icon: 'error',
                });
              }
            });
          }
        });
    });
  }

  updateStatus(): void {
    this.status_selects.forEach((form, idN) => {
      const status = this.key.image.find(i => i.idN === idN)?.status;
      form.setValue(status?.toString() ?? '', { emitEvent: false });
      if (status === 5) {
        form.disable({ emitEvent: false });
      } else {
        form.enable({ emitEvent: false });
      }
    });
  }

  get formsStatus(): FormControl[] {
    return this.key.image.length < 1 ? new Array(this.status_selects[0]) : this.status_selects;
  }

  get images(): IImage[] {
    return this.key.image
      .sort((a, b) => a.idN - b.idN)
      .filter(({ url }) => url);
  }

  get hasRole(): boolean {
    return this.user.hasRole(['EDIT', 'GRANT', 'ADMIN']);
  }

  get hasImage(): boolean | null {
    return this.images.length < 1 ? false : null;
  }

  get hasDefective() {
    return this.key.image.some(i => i.status === 0);
  }

  viewImages() {
    this.keys.showImages(this.key);
  }

  statusClass(form: FormControl): string {
    return form.value ? `idN${form.value}` : '';
  }

  configKey() {
    Swal.fire({
      title: this.key.code,
      showDenyButton: true,
      showConfirmButton: this.user.hasRole(['GRANT', 'ADMIN']),
      denyButtonText: `Editar Clave`,
      confirmButtonText: `Eliminar Clave`,
      denyButtonAriaLabel: `Editar clave ${this.key.code}`,
      confirmButtonAriaLabel: `Eliminar clave ${this.key.code}`,
      denyButtonColor: 'rgb(62, 15, 116)',
      confirmButtonColor: 'rgb(105, 8, 8)',
      keydownListenerCapture: true,
    }).then(({ isConfirmed, isDenied }) => {
      if (isConfirmed) {
        Swal.fire({
          title: '¿Estás absolutamente seguro?',
          input: 'text',
          html: `Por favor escriba <b>${this.key.code}</b> para confirmar.`,
          inputAutoTrim: true,
          inputValidator: value => {
            return value !== this.key.code ? 'Confirma correctamente' : null;
          },
          showConfirmButton: true,
          confirmButtonText: 'Entiendo las consecuencias, eliminar x',
          confirmButtonAriaLabel: `Eliminar clave ${this.key.code}`,
          confirmButtonColor: 'rgb(105, 8, 8)',
          showLoaderOnConfirm: true,
          preConfirm: () => {
            return this.exchanges
              .deleteKey(this.key._id)
              .toPromise()
              .catch(() => {
                Alert.fire({
                  title: 'Error Clave',
                  text: this.key.code,
                  icon: 'error',
                });
              });
          },
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            this.keys.delete(this.key._id);
          }
        });
      } else if (isDenied) {
        this.keys.edit(this.key);
      }
    });
  }
}
