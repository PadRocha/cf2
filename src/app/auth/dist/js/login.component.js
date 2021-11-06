"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var functions_1 = require("@shared/functions");
var operators_1 = require("rxjs/operators");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(user, router) {
        this.user = user;
        this.router = router;
        this.userData = new forms_1.FormGroup({
            nickname: new forms_1.FormControl('', forms_1.Validators.required),
            password: new forms_1.FormControl('', forms_1.Validators.required)
        });
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.getPreviousUrl();
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        this.router.events.subscribe();
    };
    LoginComponent.prototype.getPreviousUrl = function () {
        this.router.events
            .pipe(operators_1.filter(function (event) { return event instanceof router_1.RoutesRecognized; }))
            .subscribe(function (event) {
            // console.log(pre, next);
            // console.log(pre.url, next.url);
        });
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.userData.valid) {
            this.user.loginUser(this.userData.getRawValue()).subscribe({
                next: function (_a) {
                    var token = _a.token;
                    _this.user.setToken(token);
                    _this.user.update();
                    _this.router.navigate(['/home']);
                },
                error: function (err) {
                    functions_1.Alert.fire({
                        title: 'Access Denied',
                        text: 'Server error',
                        icon: 'error'
                    });
                }
            });
        }
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss']
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
