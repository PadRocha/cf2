"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AsideLinesComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var AsideLinesComponent = /** @class */ (function () {
    function AsideLinesComponent(arrivals) {
        this.arrivals = arrivals;
        this.lines = new Array();
        this.lineIsLoading = false;
        this.lineHasNextPage = false;
        this.lineTotalDocs = 0;
        this.regex = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.params = {
            page: 1
        };
        this.showSlide = false;
        this.selected = new core_1.EventEmitter();
    }
    AsideLinesComponent.prototype.ngOnInit = function () {
        this.getLines();
        this.viewRegex();
    };
    AsideLinesComponent.prototype.getLines = function () {
        var _this = this;
        this.lineIsLoading = true;
        this.arrivals.getLines(this.params).subscribe({
            next: function (_a) {
                var data = _a.data, metadata = _a.metadata;
                _this.lines = _this.lines.concat(data);
                _this.lineHasNextPage = metadata.hasNextPage;
                _this.lineTotalDocs = metadata.totalDocs;
                _this.lineIsLoading = false;
            },
            error: function (err) {
                _this.lineIsLoading = false;
            }
        });
    };
    AsideLinesComponent.prototype.isIdentifier = function (code) {
        return code.length > 0 && code.length < 7 && code.split('').every(function (c) { return c === c.toUpperCase(); });
    };
    AsideLinesComponent.prototype.viewRegex = function () {
        var _this = this;
        this.regex.valueChanges
            .pipe(operators_1.debounceTime(500), operators_1.distinctUntilChanged())
            .subscribe(function (value) {
            delete _this.params.identifier;
            delete _this.params.name;
            _this.params.page = 1;
            if (_this.regex.valid) {
                if (_this.isIdentifier(value)) {
                    _this.params.identifier = value.trim();
                }
                else {
                    _this.params.name = value.trim();
                }
            }
            _this.lines = new Array();
            _this.getLines();
        });
    };
    AsideLinesComponent.prototype.onScroll = function (_a) {
        var target = _a.target;
        var div = target;
        var scrollTotal = div.scrollHeight - div.clientHeight;
        if ((div.scrollTop / scrollTotal) > 0.90 && !this.lineIsLoading && this.lineHasNextPage) {
            ++this.params.page;
            this.getLines();
        }
    };
    AsideLinesComponent.prototype.onAll = function () {
        this.selected.emit(null);
    };
    AsideLinesComponent.prototype.onSelected = function (identifier) {
        this.selected.emit(identifier);
    };
    AsideLinesComponent.prototype.toogleSlide = function () {
        this.showSlide = !this.showSlide;
    };
    __decorate([
        core_1.HostBinding('class.hide_aside')
    ], AsideLinesComponent.prototype, "showSlide");
    __decorate([
        core_1.Output()
    ], AsideLinesComponent.prototype, "selected");
    AsideLinesComponent = __decorate([
        core_1.Component({
            selector: 'aside-lines',
            templateUrl: './aside-lines.component.html',
            styleUrls: ['./aside-lines.component.scss']
        })
    ], AsideLinesComponent);
    return AsideLinesComponent;
}());
exports.AsideLinesComponent = AsideLinesComponent;
