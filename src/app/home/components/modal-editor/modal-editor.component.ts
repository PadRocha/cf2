import { isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IImage } from '@home/models/image';
import { IKey } from '@home/models/key';
import { KeysService } from '@home/services';
import { Modal } from 'bootstrap';
import { fabric } from 'fabric';
import Swal from 'sweetalert2';

@Component({
  selector: 'modal-editor',
  templateUrl: './modal-editor.component.html',
  styleUrls: ['./modal-editor.component.scss'],
  host: {
    class: 'modal fade animate__animated animate__backInDown',
  }
})
export class ModalEditorComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  key: IKey;
  image: IImage;
  canvas_width: number;
  canvas_heigth: number;
  form_IText: FormGroup;
  private key_down: boolean;
  private modal?: Modal;
  private canvas?: fabric.Canvas;
  private canvas_line?: fabric.Line;
  @ViewChild('canvas') canvaselement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('img') img!: ElementRef<HTMLImageElement>;
  @ViewChild('draw') draw_checkbox!: ElementRef<HTMLInputElement>;

  constructor(
    private element: ElementRef<HTMLElement>,
    private keys: KeysService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.key = {
      _id: '',
      code: '',
      desc: '',
      image: new Array(),
      createdAt: new Date,
      updatedAt: new Date,
    };
    this.image = {
      idN: 0,
      status: 0,
      url: null,
      public_id: null
    };
    this.canvas_width = 708;
    this.canvas_heigth = 500;
    this.form_IText = new FormGroup({
      fill: new FormControl('', [Validators.required]),
      fontFamily: new FormControl('', [Validators.required]),
      textAlign: new FormControl('', [Validators.required]),
      backgroundColor: new FormControl('', [Validators.required]),
      textBackgroundColor: new FormControl('', [Validators.required]),
      stroke: new FormControl('', [Validators.required]),
      strokeWidth: new FormControl(1, [Validators.required]),
      fontSize: new FormControl(1, [Validators.required]),
      lineHeight: new FormControl(0, [Validators.required]),
      fontWeight: new FormControl('', [Validators.required]),
      fontStyle: new FormControl('', [Validators.required]),
      textDecoration: new FormControl('', [Validators.required]),
    });
    this.key_down = false;
  }

  ngOnInit(): void {
    this.form_IText.valueChanges.subscribe(values => {
      const IText = this.canvas?.getActiveObject() as fabric.IText;
      if (IText) {
        IText.set({
          fill: values.fill,
          fontFamily: values.fontFamily,
          textAlign: values.textAlign,
          backgroundColor: values.backgroundColor,
          textBackgroundColor: values.textBackgroundColor,
          stroke: values.stroke,
          strokeWidth: values.strokeWidth,
          fontSize: values.fontSize,
          lineHeight: values.lineHeight
        });
        this.canvas?.requestRenderAll();
      }
    });
  }

  ngAfterViewInit(): void {
    this.modal = new Modal(this.element.nativeElement);
    this.canvas = new fabric.Canvas(this.canvaselement.nativeElement);
    this.canvas.requestRenderAll();
    this.canvas.on('mouse:down', e => this.mouseDown(e));
    this.canvas.on('mouse:move', e => this.mouseMove(e));
    this.canvas.on('mouse:up', () => this.mouseUp());
    this.canvas.on('selection:updated', () => this.canvasSelection());
    this.canvas.on('selection:created', () => this.canvasSelection());
  }

  ngAfterViewChecked(): void {

  }

  ngOnDestroy(): void {
    this.hide();
  }

  @HostListener('window:resize')
  resize() {
    if (isPlatformBrowser(this.platformId)) {
      const { innerWidth } = window;
      if (innerWidth > 575 && innerWidth <= 992) {
        this.canvas_width = 466;
        this.canvas_heigth = 329.0960452;
      } else if (innerWidth < 575) {
        this.canvas_heigth = (innerWidth - 50) * this.canvas_heigth / this.canvas_width;
        this.canvas_width = (innerWidth - 50);
      } else {
        this.canvas_width = 708;
        this.canvas_heigth = 500;
      }
      this.renderImage();
    }
  }


  @HostListener('hidden.bs.modal')
  reset(): void {
    this.keys.showImages(this.key, this.image.idN);
  }

  show() {
    this.canvas?.clear();
    this.modal?.show();
    this.resize();
    this.renderImage();
  }

  hide(): void {
    this.modal?.hide();
  }

  private mouseDown({ e }: fabric.IEvent): void {
    this.key_down = true;
    const pointer = this.canvas?.getPointer(e);
    const points = [pointer?.x, pointer?.y, pointer?.x, pointer?.y] as number[];

    if (this.draw_checkbox.nativeElement.checked) {
      this.canvas_line = new fabric.Line(points, {
        strokeWidth: 5,
        fill: '#000000',
        stroke: '#000000',
        originX: 'center',
        originY: 'center',
      });
      this.canvas?.add(this.canvas_line);
    }
  }

  private mouseMove({ e }: fabric.IEvent): void {
    if (!this.key_down) return;
    const pointer = this.canvas?.getPointer(e);

    if (this.draw_checkbox.nativeElement.checked) {
      this.canvas_line?.set({
        x2: pointer?.x,
        y2: pointer?.y
      });
      this.canvas?.requestRenderAll();
    }
  }

  private mouseUp(): void {
    this.key_down = false;
    this.draw_checkbox.nativeElement.checked = false;
  }

  private canvasSelection(): void {
    if (this.canvas?.getActiveObject()?.get('type') === 'text') {
      const IText = this.canvas?.getActiveObject() as fabric.IText;
      this.form_IText.get('fill')?.setValue(IText.fill, { emitEvent: false });
      this.form_IText.get('fontFamily')?.setValue(IText.fontFamily, { emitEvent: false });
      this.form_IText.get('textAlign')?.setValue(IText.textAlign, { emitEvent: false });
      this.form_IText.get('backgroundColor')?.setValue(IText.backgroundColor, { emitEvent: false });
      this.form_IText.get('textBackgroundColor')?.setValue(IText.textBackgroundColor, { emitEvent: false });
      this.form_IText.get('stroke')?.setValue(IText.stroke, { emitEvent: false });
      this.form_IText.get('strokeWidth')?.setValue(IText.strokeWidth, { emitEvent: false });
      this.form_IText.get('fontSize')?.setValue(IText.fontSize, { emitEvent: false });
      this.form_IText.get('lineHeight')?.setValue(IText.lineHeight, { emitEvent: false });
    } else if (this.canvas?.getActiveObject()?.get('type') === 'line') {

    }
  }

  renderImage(): void {
    this.canvas?.setWidth(this.canvas_width);
    this.canvas?.setHeight(this.canvas_heigth);
    if (this.image.url) {
      fabric.Image.fromURL(this.image.url, image => {
        image.scaleToWidth(this.canvas_width);
        image.scaleToHeight(this.canvas_heigth);
        this.canvas?.setBackgroundImage(image, this.canvas.requestRenderAll.bind(this.canvas));
      });
    }
  }

  addText(): void {
    Swal.fire({
      title: 'Escriba algo',
      input: 'textarea',
      inputPlaceholder: 'Inserte el texto...',
      keydownListenerCapture: true
    }).then(({ isConfirmed, value }) => {
      if (isConfirmed) {
        this.canvas?.add(new fabric.Text(value));
      }
    });
  }

  deleteObject(): void {
    if (this.canvas?.getActiveObjects().length === 1) {
      this.canvas?.remove(this.canvas?.getActiveObject());
    } else if (<number>this.canvas?.getActiveObjects().length > 1) {
      this.canvas?.getActiveObjects().forEach(object => {
        this.canvas?.remove(object);
      });
    }
    this.canvas?.discardActiveObject();
  }

  get lineSelected() {
    return this.canvas?.getActiveObject()?.get('type') === 'line';
  }

  get textSelected() {
    return this.canvas?.getActiveObject()?.get('type') === 'text';
  }
}
