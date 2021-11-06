"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TagInputComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var TagInputComponent = /** @class */ (function () {
    function TagInputComponent() {
        this.stringTag = new forms_1.FormControl('', [forms_1.Validators.required]);
        this.regexOptions = new Array();
        this.travelOption = false;
        this.tags = new Array();
        this.optionalTags = new Array();
        this.tagsChange = new core_1.EventEmitter();
    }
    TagInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.stringTag.valueChanges.subscribe(function (value) {
            var lastChar = value.substring(value.length - 1);
            if (lastChar === ',') {
                var tagName = value.replace(',', '').toLowerCase().trim();
                if (_this.checkDuplication(tagName) || tagName === '' || tagName.includes(',')) {
                    _this.stringTag.setValue(tagName);
                    return;
                }
                if (_this.optionalTags.length > 0 && !_this.optionalTags.includes(tagName)) {
                    _this.stringTag.setValue(tagName);
                    return;
                }
                _this.tags.push(tagName);
                _this.stringTag.reset('');
                _this.tagsChange.emit(_this.tags);
            }
            if (_this.stringTag.valid)
                _this.regexOptions = _this.optionalTags.filter(function (tag) { return new RegExp(value, 'i').test(tag) && !_this.checkDuplication(tag); });
            else
                _this.regexOptions = new Array();
        });
    };
    TagInputComponent.prototype.optionClick = function (option) {
        this.stringTag.reset('');
        this.tags.push(option);
        this.regexOptions = new Array();
        this.tagsChange.emit(this.tags);
        this.tagInput.nativeElement.focus();
    };
    /**
     * Checks for duplicate items in the tag list
     */
    TagInputComponent.prototype.checkDuplication = function (tag) {
        return this.tags.indexOf(tag) > -1 ? true : false;
    };
    /**
     * If the user uses Delete or Backspace on an empty form
     * field, set the value to the last tag
     */
    TagInputComponent.prototype.checkBackspaceOnEmpty = function (_a) {
        var key = _a.key;
        if (this.tags.length > 0 && (key === 'Enter' || key === 'Backspace') && !this.stringTag.valid) {
            var lastVal = this.tags.pop();
            this.stringTag.setValue(lastVal + ' ');
            this.tagsChange.emit(this.tags);
        }
    };
    /**
     * If element gets blur will reset the  regex Options
     */
    TagInputComponent.prototype.blurTag = function () {
        var _this = this;
        if (!this.travelOption)
            setTimeout(function () {
                _this.regexOptions = new Array();
            }, 200);
    };
    /**
     * Removes the tag from the array if clicked on
     */
    TagInputComponent.prototype.removeTag = function (index) {
        this.tags.splice(index, 1);
        this.tagsChange.emit(this.tags);
    };
    TagInputComponent.prototype.optionsFocus = function (_a) {
        var firstChild = _a.firstChild;
        if (this.regexOptions.length > 0) {
            this.travelOption = true;
            firstChild.focus();
        }
    };
    TagInputComponent.prototype.nextFocus = function (_a, index) {
        var target = _a.target, key = _a.key;
        if (key === 'ArrowDown' && index !== this.regexOptions.length - 1) {
            target.nextSibling.focus();
        }
        else if (key === 'ArrowUp' && index !== 0) {
            target.previousSibling.focus();
        }
        else if (key === 'ArrowUp' && index === 0) {
            this.tagInput.nativeElement.focus();
        }
        else if (key === 'Escape') {
            this.regexOptions = new Array();
        }
    };
    TagInputComponent.prototype.exists = function (tag) {
        return !!this.optionalTags.length && !this.optionalTags.some(function (option) { return option === tag; });
    };
    __decorate([
        core_1.Input()
    ], TagInputComponent.prototype, "tags");
    __decorate([
        core_1.Input()
    ], TagInputComponent.prototype, "optionalTags");
    __decorate([
        core_1.Output()
    ], TagInputComponent.prototype, "tagsChange");
    __decorate([
        core_1.ViewChild('tagInput')
    ], TagInputComponent.prototype, "tagInput");
    TagInputComponent = __decorate([
        core_1.Component({
            selector: 'tag-input',
            templateUrl: './tag-input.component.html',
            styleUrls: ['./tag-input.component.scss']
        })
    ], TagInputComponent);
    return TagInputComponent;
}());
exports.TagInputComponent = TagInputComponent;
