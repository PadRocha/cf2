"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.KeysService = void 0;
var core_1 = require("@angular/core");
var environment_1 = require("@environments/environment");
var components_1 = require("@home/components");
var functions_1 = require("@shared/functions");
var rxjs_1 = require("rxjs");
var KeysService = /** @class */ (function () {
    function KeysService(http) {
        this.http = http;
        this.viewChange$ = new rxjs_1.Subject();
        this.resetSatus = new rxjs_1.Subject();
        this.url = environment_1.environment.httpUrl;
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
        this.keys_array = new Array();
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
    KeysService.prototype.getView = function () {
        var _this = this;
        this.viewChange$.subscribe(function (view) {
            _this.view = view;
        });
    };
    Object.defineProperty(KeysService.prototype, "container", {
        set: function (view) {
            this.viewChange$.next(view);
        },
        enumerable: false,
        configurable: true
    });
    KeysService.prototype.getKeys = function (params) {
        return this.http.get(this.url + "/key", { params: params, withCredentials: false });
    };
    KeysService.prototype.getKeysInfo = function (params) {
        return this.http.get(this.url + "/key/info", { params: params, withCredentials: false });
    };
    KeysService.prototype.getNextLast = function (code) {
        return this.http.get(this.url + "/key/" + code + "/next");
    };
    KeysService.prototype.reset = function () {
        this.keys_array = new Array();
        this.page = 0;
    };
    KeysService.prototype.more = function () {
        var _this = this;
        ++this.page;
        this.loading = true;
        this.getKeys(__assign({ page: this.page }, this.params)).subscribe({
            next: function (_a) {
                var data = _a.data, metadata = _a.metadata;
                _this.keys_array = _this.keys_array.concat(data);
                _this.metadata = metadata;
                _this.loading = false;
            },
            error: function (err) {
                _this.loading = false;
            }
        });
    };
    KeysService.prototype.showImages = function (key, idN) {
        if (!!this.view) {
            this.view.clear();
            this.modalImage = this.view.createComponent(components_1.ModalImageComponent);
            this.modalImage.instance.key = key;
            this.modalImage.changeDetectorRef.detectChanges();
            this.modalImage.instance.show(idN);
        }
    };
    KeysService.prototype.edit = function (key) {
        if (!!this.view) {
            this.view.clear();
            this.modalKey = this.view.createComponent(components_1.ModalKeyComponent);
            this.modalKey.instance.key = key;
            this.modalKey.changeDetectorRef.detectChanges();
            this.modalKey.instance.show();
        }
    };
    KeysService.prototype.editImage = function (key, image) {
        if (!!this.view) {
            this.view.clear();
            this.modalEditor = this.view.createComponent(components_1.ModalEditorComponent);
            this.modalEditor.instance.key = key;
            this.modalEditor.instance.image = image;
            this.modalEditor.changeDetectorRef.detectChanges();
            this.modalEditor.instance.show();
        }
    };
    Object.defineProperty(KeysService.prototype, "refresh", {
        set: function (params) {
            var _this = this;
            this.params = params;
            this.reset();
            this.more();
            this.getKeysInfo(params).subscribe(function (_a) {
                var data = _a.data;
                return _this.info = data;
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeysService.prototype, "get", {
        get: function () {
            return this.keys_array.sort(function (a, b) { return (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0); });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeysService.prototype, "hasNextPage", {
        get: function () {
            return this.metadata.hasNextPage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeysService.prototype, "percentage", {
        get: function () {
            if (this.info.success === 0) {
                return 0;
            }
            return 100 * this.info.success / this.metadata.totalDocs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeysService.prototype, "total", {
        get: function () {
            return this.metadata.totalDocs;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeysService.prototype, "isEmpty", {
        get: function () {
            return this.keys_array.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeysService.prototype, "prev", {
        set: function (code) {
            var _a, _b;
            if (this.keys_array.length > 1) {
                var index = this.keys_array.findIndex(function (k) { return k.code === code; });
                if (index !== 0) {
                    do {
                        --index;
                    } while (!((_b = (_a = this.keys_array[index]) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.some(function (i) { return i.status === 5; })) && index !== 0);
                    if (!!this.modalImage) {
                        this.modalImage.instance.key = this.keys_array[index];
                    }
                }
                else {
                    functions_1.Alert.fire({
                        title: 'No hay imagen anterior',
                        text: 'Es la primera',
                        icon: 'error'
                    });
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeysService.prototype, "next", {
        set: function (code) {
            var _a, _b;
            if (this.keys_array.length > 1) {
                var index = this.keys_array.findIndex(function (k) { return k.code === code; });
                if (index !== this.keys_array.length - 1) {
                    do {
                        ++index;
                    } while (!((_b = (_a = this.keys_array[index]) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.some(function (i) { return i.status === 5; })) && index < this.keys_array.length);
                    if (!!this.modalImage) {
                        this.modalImage.instance.key = this.keys_array[index];
                    }
                }
                else {
                    functions_1.Alert.fire({
                        title: 'No hay imagen siguiente',
                        text: 'Consulta más',
                        icon: 'error'
                    });
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    KeysService.prototype["delete"] = function (_id) {
        return __awaiter(this, void 0, void 0, function () {
            var lastCode, last, index, successDeleted;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastCode = this.keys_array[this.keys_array.length - 1].code;
                        return [4 /*yield*/, this.getNextLast(lastCode).toPromise()["catch"](function () { return null; })];
                    case 1:
                        last = _a.sent();
                        if (last === null || last === void 0 ? void 0 : last.data) {
                            this.keys_array.push(last.data);
                        }
                        index = this.keys_array.findIndex(function (i) { return i._id === _id; });
                        successDeleted = false;
                        this.keys_array[index].image.forEach(function (_a) {
                            var status = _a.status;
                            if (status === 5 && !successDeleted) {
                                _this.substractSuccess();
                                successDeleted = true;
                            }
                            _this.substractStatus = status;
                        });
                        --this.metadata.totalDocs;
                        this.keys_array.splice(index, 1);
                        return [2 /*return*/];
                }
            });
        });
    };
    KeysService.prototype.deleteImage = function (_id, image) {
        var index = this.keys_array.findIndex(function (i) { return i._id === _id; });
        var indexImage = this.keys_array[index].image.findIndex(function (i) { return i.idN === image.idN; });
        if (this.keys_array[index].image.filter(function (i) { return i.status === 5; }).length === 1)
            this.substractSuccess();
        this.keys_array[index].image.splice(indexImage, 1);
        this.substractStatus = image.status;
        this.resetSatus.next(index);
    };
    Object.defineProperty(KeysService.prototype, "update", {
        set: function (key) {
            var _a, _b;
            var index = this.keys_array.findIndex(function (i) { return i._id === key._id; });
            this.keys_array[index].code = ((_a = key.line) === null || _a === void 0 ? void 0 : _a.identifier) + ((_b = key.line) === null || _b === void 0 ? void 0 : _b.supplier.identifier) + key.code;
            this.keys_array[index].desc = key.desc;
        },
        enumerable: false,
        configurable: true
    });
    KeysService.prototype.updateImage = function (_id, image) {
        var index = this.keys_array.findIndex(function (i) { return i._id === _id; });
        var indexImage = this.keys_array[index].image.findIndex(function (i) { return i.idN === image.idN; });
        this.keys_array[index].image[indexImage] = image;
    };
    KeysService.prototype.resetImage = function (_id, status) {
        var _this = this;
        var index = this.keys_array.findIndex(function (i) { return i._id === _id; });
        var successMatch = false;
        this.keys_array[index].image.forEach(function (_a) {
            var status = _a.status;
            if (status === 5 && !successMatch) {
                _this.substractSuccess();
                successMatch = true;
            }
            _this.substractStatus = status;
        });
        var new_image = new Array();
        for (var idN = 0; idN < 3; idN++) {
            new_image.push({
                idN: idN,
                status: status,
                public_id: null,
                url: null
            });
        }
        this.keys_array[index].image = new_image;
        this.resetSatus.next(index);
    };
    KeysService.prototype.addSuccess = function () {
        ++this.info.success;
    };
    KeysService.prototype.substractSuccess = function () {
        --this.info.success;
    };
    KeysService.prototype.status = function (type) {
        var name = this.statusName(type);
        if (name) {
            return this.info.status[name];
        }
        else {
            return 0;
        }
    };
    KeysService.prototype.statusName = function (status) {
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
    };
    Object.defineProperty(KeysService.prototype, "addStatus", {
        set: function (type) {
            var name = this.statusName(type);
            if (name)
                ++this.info.status[name];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(KeysService.prototype, "substractStatus", {
        set: function (type) {
            var name = this.statusName(type);
            if (name)
                --this.info.status[name];
        },
        enumerable: false,
        configurable: true
    });
    KeysService.prototype.replace = function (pre, next) {
        if (pre)
            this.substractStatus = +pre;
        if (next)
            this.addStatus = +next;
    };
    KeysService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], KeysService);
    return KeysService;
}());
exports.KeysService = KeysService;
