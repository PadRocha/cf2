"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.ModalEditorComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var bootstrap_1 = require("bootstrap");
var fabric_1 = require("fabric");
var sweetalert2_1 = require("sweetalert2");
var ModalEditorComponent = /** @class */ (function () {
    function ModalEditorComponent(element, keys, platformId) {
        this.element = element;
        this.keys = keys;
        this.platformId = platformId;
        this.key = {
            _id: '',
            code: '',
            desc: '',
            image: new Array(),
            createdAt: new Date,
            updatedAt: new Date
        };
        this.image = {
            idN: 0,
            status: 0,
            url: null,
            public_id: null
        };
        this.canvas_width = 708;
        this.canvas_heigth = 500;
        this.form_IText = new forms_1.FormGroup({
            fill: new forms_1.FormControl('', [forms_1.Validators.required]),
            fontFamily: new forms_1.FormControl('', [forms_1.Validators.required]),
            textAlign: new forms_1.FormControl('', [forms_1.Validators.required]),
            backgroundColor: new forms_1.FormControl('', [forms_1.Validators.required]),
            textBackgroundColor: new forms_1.FormControl('', [forms_1.Validators.required]),
            stroke: new forms_1.FormControl('', [forms_1.Validators.required]),
            strokeWidth: new forms_1.FormControl(1, [forms_1.Validators.required]),
            fontSize: new forms_1.FormControl(1, [forms_1.Validators.required]),
            lineHeight: new forms_1.FormControl(0, [forms_1.Validators.required]),
            fontWeight: new forms_1.FormControl('', [forms_1.Validators.required]),
            fontStyle: new forms_1.FormControl('', [forms_1.Validators.required]),
            textDecoration: new forms_1.FormControl('', [forms_1.Validators.required])
        });
        this.key_down = false;
    }
    ModalEditorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.form_IText.valueChanges.subscribe(function (values) {
            var _a, _b;
            var IText = (_a = _this.canvas) === null || _a === void 0 ? void 0 : _a.getActiveObject();
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
                (_b = _this.canvas) === null || _b === void 0 ? void 0 : _b.requestRenderAll();
            }
        });
    };
    ModalEditorComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.modal = new bootstrap_1.Modal(this.element.nativeElement);
        this.canvas = new fabric_1.fabric.Canvas(this.canvaselement.nativeElement);
        this.canvas.requestRenderAll();
        this.canvas.on('mouse:down', function (e) { return _this.mouseDown(e); });
        this.canvas.on('mouse:move', function (e) { return _this.mouseMove(e); });
        this.canvas.on('mouse:up', function () { return _this.mouseUp(); });
        this.canvas.on('selection:updated', function () { return _this.canvasSelection(); });
        this.canvas.on('selection:created', function () { return _this.canvasSelection(); });
    };
    ModalEditorComponent.prototype.ngAfterViewChecked = function () {
    };
    ModalEditorComponent.prototype.ngOnDestroy = function () {
        this.hide();
    };
    ModalEditorComponent.prototype.resize = function () {
        if (common_1.isPlatformBrowser(this.platformId)) {
            var innerWidth = window.innerWidth;
            if (innerWidth > 575 && innerWidth <= 992) {
                this.canvas_width = 466;
                this.canvas_heigth = 329.0960452;
            }
            else if (innerWidth < 575) {
                this.canvas_heigth = (innerWidth - 50) * this.canvas_heigth / this.canvas_width;
                this.canvas_width = (innerWidth - 50);
            }
            else {
                this.canvas_width = 708;
                this.canvas_heigth = 500;
            }
            this.renderImage();
        }
    };
    ModalEditorComponent.prototype.reset = function () {
        this.keys.showImages(this.key, this.image.idN);
    };
    ModalEditorComponent.prototype.show = function () {
        var _a, _b;
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.clear();
        (_b = this.modal) === null || _b === void 0 ? void 0 : _b.show();
        this.resize();
        this.renderImage();
    };
    ModalEditorComponent.prototype.hide = function () {
        var _a;
        (_a = this.modal) === null || _a === void 0 ? void 0 : _a.hide();
    };
    ModalEditorComponent.prototype.mouseDown = function (_a) {
        var _b, _c;
        var e = _a.e;
        this.key_down = true;
        var pointer = (_b = this.canvas) === null || _b === void 0 ? void 0 : _b.getPointer(e);
        var points = [pointer === null || pointer === void 0 ? void 0 : pointer.x, pointer === null || pointer === void 0 ? void 0 : pointer.y, pointer === null || pointer === void 0 ? void 0 : pointer.x, pointer === null || pointer === void 0 ? void 0 : pointer.y];
        if (this.draw_checkbox.nativeElement.checked) {
            this.canvas_line = new fabric_1.fabric.Line(points, {
                strokeWidth: 5,
                fill: '#000000',
                stroke: '#000000',
                originX: 'center',
                originY: 'center'
            });
            (_c = this.canvas) === null || _c === void 0 ? void 0 : _c.add(this.canvas_line);
        }
    };
    ModalEditorComponent.prototype.mouseMove = function (_a) {
        var _b, _c, _d;
        var e = _a.e;
        if (!this.key_down)
            return;
        var pointer = (_b = this.canvas) === null || _b === void 0 ? void 0 : _b.getPointer(e);
        if (this.draw_checkbox.nativeElement.checked) {
            (_c = this.canvas_line) === null || _c === void 0 ? void 0 : _c.set({
                x2: pointer === null || pointer === void 0 ? void 0 : pointer.x,
                y2: pointer === null || pointer === void 0 ? void 0 : pointer.y
            });
            (_d = this.canvas) === null || _d === void 0 ? void 0 : _d.requestRenderAll();
        }
    };
    ModalEditorComponent.prototype.mouseUp = function () {
        this.key_down = false;
        this.draw_checkbox.nativeElement.checked = false;
    };
    ModalEditorComponent.prototype.canvasSelection = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        if (((_b = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getActiveObject()) === null || _b === void 0 ? void 0 : _b.get('type')) === 'text') {
            var IText = (_c = this.canvas) === null || _c === void 0 ? void 0 : _c.getActiveObject();
            (_d = this.form_IText.get('fill')) === null || _d === void 0 ? void 0 : _d.setValue(IText.fill, { emitEvent: false });
            (_e = this.form_IText.get('fontFamily')) === null || _e === void 0 ? void 0 : _e.setValue(IText.fontFamily, { emitEvent: false });
            (_f = this.form_IText.get('textAlign')) === null || _f === void 0 ? void 0 : _f.setValue(IText.textAlign, { emitEvent: false });
            (_g = this.form_IText.get('backgroundColor')) === null || _g === void 0 ? void 0 : _g.setValue(IText.backgroundColor, { emitEvent: false });
            (_h = this.form_IText.get('textBackgroundColor')) === null || _h === void 0 ? void 0 : _h.setValue(IText.textBackgroundColor, { emitEvent: false });
            (_j = this.form_IText.get('stroke')) === null || _j === void 0 ? void 0 : _j.setValue(IText.stroke, { emitEvent: false });
            (_k = this.form_IText.get('strokeWidth')) === null || _k === void 0 ? void 0 : _k.setValue(IText.strokeWidth, { emitEvent: false });
            (_l = this.form_IText.get('fontSize')) === null || _l === void 0 ? void 0 : _l.setValue(IText.fontSize, { emitEvent: false });
            (_m = this.form_IText.get('lineHeight')) === null || _m === void 0 ? void 0 : _m.setValue(IText.lineHeight, { emitEvent: false });
        }
        else if (((_p = (_o = this.canvas) === null || _o === void 0 ? void 0 : _o.getActiveObject()) === null || _p === void 0 ? void 0 : _p.get('type')) === 'line') {
        }
    };
    ModalEditorComponent.prototype.renderImage = function () {
        var _this = this;
        var _a, _b;
        (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.setWidth(this.canvas_width);
        (_b = this.canvas) === null || _b === void 0 ? void 0 : _b.setHeight(this.canvas_heigth);
        if (this.image.url) {
            fabric_1.fabric.Image.fromURL(this.image.url, function (image) {
                var _a;
                image.scaleToWidth(_this.canvas_width);
                image.scaleToHeight(_this.canvas_heigth);
                (_a = _this.canvas) === null || _a === void 0 ? void 0 : _a.setBackgroundImage(image, _this.canvas.requestRenderAll.bind(_this.canvas));
            });
        }
    };
    ModalEditorComponent.prototype.addText = function () {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Escriba algo',
            input: 'textarea',
            inputPlaceholder: 'Inserte el texto...',
            keydownListenerCapture: true
        }).then(function (_a) {
            var _b;
            var isConfirmed = _a.isConfirmed, value = _a.value;
            if (isConfirmed) {
                (_b = _this.canvas) === null || _b === void 0 ? void 0 : _b.add(new fabric_1.fabric.Text(value));
            }
        });
    };
    ModalEditorComponent.prototype.deleteObject = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        if (((_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getActiveObjects().length) === 1) {
            (_b = this.canvas) === null || _b === void 0 ? void 0 : _b.remove((_c = this.canvas) === null || _c === void 0 ? void 0 : _c.getActiveObject());
        }
        else if (((_d = this.canvas) === null || _d === void 0 ? void 0 : _d.getActiveObjects().length) > 1) {
            (_e = this.canvas) === null || _e === void 0 ? void 0 : _e.getActiveObjects().forEach(function (object) {
                var _a;
                (_a = _this.canvas) === null || _a === void 0 ? void 0 : _a.remove(object);
            });
        }
        (_f = this.canvas) === null || _f === void 0 ? void 0 : _f.discardActiveObject();
    };
    Object.defineProperty(ModalEditorComponent.prototype, "lineSelected", {
        get: function () {
            var _a, _b;
            return ((_b = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getActiveObject()) === null || _b === void 0 ? void 0 : _b.get('type')) === 'line';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ModalEditorComponent.prototype, "textSelected", {
        get: function () {
            var _a, _b;
            return ((_b = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getActiveObject()) === null || _b === void 0 ? void 0 : _b.get('type')) === 'text';
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        core_1.ViewChild('canvas')
    ], ModalEditorComponent.prototype, "canvaselement");
    __decorate([
        core_1.ViewChild('img')
    ], ModalEditorComponent.prototype, "img");
    __decorate([
        core_1.ViewChild('draw')
    ], ModalEditorComponent.prototype, "draw_checkbox");
    __decorate([
        core_1.HostListener('window:resize')
    ], ModalEditorComponent.prototype, "resize");
    __decorate([
        core_1.HostListener('hidden.bs.modal')
    ], ModalEditorComponent.prototype, "reset");
    ModalEditorComponent = __decorate([
        core_1.Component({
            selector: 'modal-editor',
            templateUrl: './modal-editor.component.html',
            styleUrls: ['./modal-editor.component.scss'],
            host: {
                "class": 'modal fade animate__animated animate__backInDown'
            }
        }),
        __param(2, core_1.Inject(core_1.PLATFORM_ID))
    ], ModalEditorComponent);
    return ModalEditorComponent;
}());
exports.ModalEditorComponent = ModalEditorComponent;
