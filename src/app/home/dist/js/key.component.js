"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.KeyComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var functions_1 = require("@shared/functions");
var operators_1 = require("rxjs/operators");
var sweetalert2_1 = require("sweetalert2");
var KeyComponent = /** @class */ (function () {
    function KeyComponent(user, keys, exchanges, shippings) {
        this.user = user;
        this.keys = keys;
        this.exchanges = exchanges;
        this.shippings = shippings;
        this.status_selects = new Array(new forms_1.FormControl(''), new forms_1.FormControl(''), new forms_1.FormControl(''));
    }
    KeyComponent.prototype.ngOnInit = function () {
        this.formsConfig();
    };
    KeyComponent.prototype.formsConfig = function () {
        var _this = this;
        this.updateStatus();
        this.status_selects.forEach(function (form, idN) {
            var _a;
            var status = (_a = _this.key.image.find(function (i) { return i.idN === idN; })) === null || _a === void 0 ? void 0 : _a.status;
            form.valueChanges
                .pipe(operators_1.debounceTime(500), operators_1.startWith(status !== null && status !== void 0 ? status : ''), operators_1.pairwise())
                .subscribe(function (_a) {
                var prev = _a[0], next = _a[1];
                return __awaiter(_this, void 0, void 0, function () {
                    var file_1, reader, body;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(next === '5')) return [3 /*break*/, 2];
                                if (prev === '')
                                    return [2 /*return*/, form.setValue(prev, { emitEvent: false })];
                                else if (prev === '5' && next === '5')
                                    return [2 /*return*/, form.setValue('', { emitEvent: false })];
                                return [4 /*yield*/, sweetalert2_1["default"].fire({
                                        title: 'Select image',
                                        input: 'file',
                                        inputAttributes: {
                                            'accept': 'image/*',
                                            'aria-label': 'Upload your profile picture'
                                        }
                                    }).then(function (result) {
                                        if (result.isDismissed || result.isDenied)
                                            form.setValue(prev);
                                        return result;
                                    })];
                            case 1:
                                file_1 = (_b.sent()).value;
                                if (file_1) {
                                    reader = new FileReader();
                                    reader.onload = function (_a) {
                                        var target = _a.target;
                                        sweetalert2_1["default"].fire({
                                            title: '¿Seguro de querer subir imagen?',
                                            imageUrl: target === null || target === void 0 ? void 0 : target.result,
                                            imageAlt: 'Imagen pendiente',
                                            showConfirmButton: true,
                                            confirmButtonText: 'Subir',
                                            focusConfirm: true,
                                            showLoaderOnConfirm: true,
                                            preConfirm: function () {
                                                var formData = new FormData();
                                                formData.append('image', file_1, file_1.name);
                                                return _this.shippings
                                                    .sendImage(_this.key._id, idN, formData)
                                                    .toPromise()["catch"](function () {
                                                    form.setValue(prev);
                                                    form.enable({ emitEvent: false });
                                                    functions_1.Alert.fire({
                                                        title: 'Error Imagen',
                                                        text: _this.key.code + " ~ [" + (idN + 1) + "] image",
                                                        icon: 'error'
                                                    });
                                                });
                                            }
                                        }).then(function (_a) {
                                            var isConfirmed = _a.isConfirmed, value = _a.value;
                                            if (isConfirmed && value) {
                                                _this.keys.replace(prev, next);
                                                if (_this.key.image.filter(function (i) { return i.status === 5; }).length === 0)
                                                    _this.keys.addSuccess();
                                                _this.key.image = value.data.image;
                                                form.disable({ emitEvent: false });
                                                functions_1.Alert.fire({
                                                    title: 'Imagen Actualizada',
                                                    text: _this.key.code + " ~ [" + (idN + 1) + "] image",
                                                    icon: 'success'
                                                });
                                            }
                                            else {
                                                form.setValue(prev);
                                            }
                                        });
                                    };
                                    reader.readAsDataURL(file_1);
                                }
                                else {
                                    form.setValue(prev);
                                }
                                return [3 /*break*/, 3];
                            case 2:
                                if (prev !== '5' && next !== '5') {
                                    body = next ? { status: +next } : {};
                                    form.disable({ emitEvent: false });
                                    this.exchanges.updateStatus(this.key._id, idN, body).subscribe({
                                        next: function (_a) {
                                            var data = _a.data;
                                            _this.key.image = data.image;
                                            _this.keys.replace(prev, next);
                                            form.enable({ emitEvent: false });
                                            functions_1.Alert.fire({
                                                title: 'Actualizado',
                                                text: _this.key.code + " ~ [" + (idN + 1) + "] status",
                                                icon: 'success'
                                            });
                                        },
                                        error: function () {
                                            form.setValue(prev);
                                            form.enable({ emitEvent: false });
                                            functions_1.Alert.fire({
                                                title: 'Error Actualización',
                                                text: _this.key.code + " ~ [" + (idN + 1) + "] status",
                                                icon: 'error'
                                            });
                                        }
                                    });
                                }
                                _b.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            });
        });
    };
    KeyComponent.prototype.updateStatus = function () {
        var _this = this;
        this.status_selects.forEach(function (form, idN) {
            var _a, _b;
            var status = (_a = _this.key.image.find(function (i) { return i.idN === idN; })) === null || _a === void 0 ? void 0 : _a.status;
            form.setValue((_b = status === null || status === void 0 ? void 0 : status.toString()) !== null && _b !== void 0 ? _b : '', { emitEvent: false });
            if (status === 5) {
                form.disable({ emitEvent: false });
            }
            else {
                form.enable({ emitEvent: false });
            }
        });
    };
    Object.defineProperty(KeyComponent.prototype, "formsStatus", {
        get: function () {
            return this.key.image.length < 1 ? new Array(this.status_selects[0]) : this.status_selects;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeyComponent.prototype, "images", {
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
    Object.defineProperty(KeyComponent.prototype, "hasRole", {
        get: function () {
            return this.user.hasRole(['EDIT', 'GRANT', 'ADMIN']);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeyComponent.prototype, "hasImage", {
        get: function () {
            return this.images.length < 1 ? false : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeyComponent.prototype, "hasDefective", {
        get: function () {
            return this.key.image.some(function (i) { return i.status === 0; });
        },
        enumerable: false,
        configurable: true
    });
    KeyComponent.prototype.viewImages = function () {
        this.keys.showImages(this.key);
    };
    KeyComponent.prototype.statusClass = function (form) {
        return form.value ? "idN" + form.value : '';
    };
    KeyComponent.prototype.configKey = function () {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: this.key.code,
            showDenyButton: true,
            showConfirmButton: this.user.hasRole(['GRANT', 'ADMIN']),
            denyButtonText: "Editar Clave",
            confirmButtonText: "Eliminar Clave",
            denyButtonAriaLabel: "Editar clave " + this.key.code,
            confirmButtonAriaLabel: "Eliminar clave " + this.key.code,
            denyButtonColor: 'rgb(62, 15, 116)',
            confirmButtonColor: 'rgb(105, 8, 8)',
            keydownListenerCapture: true
        }).then(function (_a) {
            var isConfirmed = _a.isConfirmed, isDenied = _a.isDenied;
            if (isConfirmed) {
                sweetalert2_1["default"].fire({
                    title: '¿Estás absolutamente seguro?',
                    input: 'text',
                    html: "Por favor escriba <b>" + _this.key.code + "</b> para confirmar.",
                    inputAutoTrim: true,
                    inputValidator: function (value) {
                        return value !== _this.key.code ? 'Confirma correctamente' : null;
                    },
                    showConfirmButton: true,
                    confirmButtonText: 'Entiendo las consecuencias, eliminar x',
                    confirmButtonAriaLabel: "Eliminar clave " + _this.key.code,
                    confirmButtonColor: 'rgb(105, 8, 8)',
                    showLoaderOnConfirm: true,
                    preConfirm: function () {
                        return _this.exchanges
                            .deleteKey(_this.key._id)
                            .toPromise()["catch"](function () {
                            functions_1.Alert.fire({
                                title: 'Error Clave',
                                text: _this.key.code,
                                icon: 'error'
                            });
                        });
                    }
                }).then(function (_a) {
                    var isConfirmed = _a.isConfirmed;
                    if (isConfirmed) {
                        _this.keys["delete"](_this.key._id);
                    }
                });
            }
            else if (isDenied) {
                _this.keys.edit(_this.key);
            }
        });
    };
    __decorate([
        core_1.Input()
    ], KeyComponent.prototype, "key");
    KeyComponent = __decorate([
        core_1.Component({
            selector: 'key',
            templateUrl: './key.component.html',
            styleUrls: ['./key.component.scss'],
            host: { "class": 'd-flex flex-column flex-lg-row border-bottom border-dark' }
        })
    ], KeyComponent);
    return KeyComponent;
}());
exports.KeyComponent = KeyComponent;
