"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ModalKeyComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var base_1 = require("@cloudinary/base");
var resize_1 = require("@cloudinary/base/actions/resize");
var environment_1 = require("@environments/environment");
var functions_1 = require("@shared/functions");
var bootstrap_1 = require("bootstrap");
var ModalKeyComponent = /** @class */ (function () {
    function ModalKeyComponent(element, keys, exchanges) {
        this.element = element;
        this.keys = keys;
        this.exchanges = exchanges;
        this.key = {
            _id: '',
            code: '',
            desc: '',
            image: new Array(),
            createdAt: new Date,
            updatedAt: new Date
        };
        this.keyUpdate = new forms_1.FormGroup({
            line: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(6), forms_1.Validators.maxLength(6)]),
            code: new forms_1.FormControl('', [forms_1.Validators.required, forms_1.Validators.minLength(4), forms_1.Validators.maxLength(4)]),
            desc: new forms_1.FormControl('', [forms_1.Validators.required])
        });
        this.resetImage = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.isLoading = false;
        this.cloudinary = environment_1.environment.cloudinary;
    }
    ModalKeyComponent.prototype.ngAfterViewInit = function () {
        this.modal = new bootstrap_1.Modal(this.element.nativeElement);
    };
    ModalKeyComponent.prototype.ngOnDestroy = function () {
        this.hide();
    };
    Object.defineProperty(ModalKeyComponent.prototype, "images", {
        get: function () {
            return this.key.image
                .sort(function (a, b) { return a.idN - b.idN; })
                .filter(function (_a) {
                var url = _a.url;
                return url;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ModalKeyComponent.prototype, "lineValidator", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.keyUpdate.get('line')) === null || _a === void 0 ? void 0 : _a.invalid) !== null && _b !== void 0 ? _b : false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ModalKeyComponent.prototype, "codeValidator", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.keyUpdate.get('code')) === null || _a === void 0 ? void 0 : _a.invalid) !== null && _b !== void 0 ? _b : false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ModalKeyComponent.prototype, "descValidator", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.keyUpdate.get('desc')) === null || _a === void 0 ? void 0 : _a.invalid) !== null && _b !== void 0 ? _b : false;
        },
        enumerable: false,
        configurable: true
    });
    ModalKeyComponent.prototype.setKey = function () {
        var _a, _b, _c;
        (_a = this.keyUpdate.get('line')) === null || _a === void 0 ? void 0 : _a.setValue(this.key.code.slice(0, 6));
        (_b = this.keyUpdate.get('code')) === null || _b === void 0 ? void 0 : _b.setValue(this.key.code.slice(6, 10));
        (_c = this.keyUpdate.get('desc')) === null || _c === void 0 ? void 0 : _c.setValue(this.key.desc);
    };
    ModalKeyComponent.prototype.show = function () {
        var _a;
        (_a = this.modal) === null || _a === void 0 ? void 0 : _a.show();
        this.setKey();
    };
    ModalKeyComponent.prototype.hide = function () {
        var _a;
        (_a = this.modal) === null || _a === void 0 ? void 0 : _a.hide();
    };
    ModalKeyComponent.prototype.transform = function (image) {
        return new base_1.CloudinaryImage(image.public_id, { cloudName: this.cloudinary })
            .resize(resize_1.Resize.scale().width(119))
            .toURL();
    };
    ModalKeyComponent.prototype.statusClass = function () {
        return this.resetImage.value ? "idN" + this.resetImage.value : '';
    };
    ModalKeyComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.keyUpdate.valid && !this.isLoading) {
            this.isLoading = true;
            this.exchanges.updateKey(this.key._id, this.keyUpdate.getRawValue()).subscribe({
                next: function (_a) {
                    var data = _a.data;
                    _this.keys.update = data;
                    _this.hide();
                    _this.isLoading = false;
                    functions_1.Alert.fire({
                        title: 'Clave Actualizada',
                        text: _this.key.code,
                        icon: 'success'
                    });
                },
                error: function () {
                    _this.isLoading = false;
                    functions_1.Alert.fire({
                        title: 'Error Actualización',
                        text: _this.key.code,
                        icon: 'error'
                    });
                }
            });
        }
    };
    ModalKeyComponent.prototype.onReset = function () {
        var _this = this;
        if (!this.isLoading) {
            this.isLoading = true;
            var type_1 = this.resetImage.value;
            var body = type_1 ? { status: +type_1 } : {};
            this.exchanges.resetKey(this.key._id, body).subscribe({
                next: function (_a) {
                    var data = _a.data;
                    _this.keys.resetImage(_this.key._id, type_1);
                    _this.hide();
                    _this.isLoading = false;
                    functions_1.Alert.fire({
                        title: 'Imagenes Reseteadas',
                        text: _this.key.code,
                        icon: 'success'
                    });
                },
                error: function () {
                    _this.isLoading = false;
                    functions_1.Alert.fire({
                        title: 'Error Actualización',
                        text: _this.key.code,
                        icon: 'error'
                    });
                }
            });
        }
    };
    ModalKeyComponent = __decorate([
        core_1.Component({
            selector: 'modal-key',
            templateUrl: './modal-key.component.html',
            styleUrls: ['./modal-key.component.scss'],
            host: {
                "class": 'modal fade animate__animated animate__backInDown',
                tabindex: '-1'
            }
        })
    ], ModalKeyComponent);
    return ModalKeyComponent;
}());
exports.ModalKeyComponent = ModalKeyComponent;
