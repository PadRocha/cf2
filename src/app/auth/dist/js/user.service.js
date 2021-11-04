"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.UserService = void 0;
var core_1 = require("@angular/core");
var services_1 = require("@auth/services");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
;
var UserService = /** @class */ (function (_super) {
    __extends(UserService, _super);
    function UserService(override, http, override, router, override, platformId) {
        var _this = _super.call(this, http, router, platformId) || this;
        _this.override = override;
        _this.override = override;
        _this.override = override;
        _this.data$ = _this.http.get(_this.url + "/user");
        _this.userChange$ = new rxjs_1.BehaviorSubject({
            identifier: null,
            nickname: null,
            roles: new Array()
        });
        if (_this.loggedIn)
            _this.update();
        return _this;
    }
    UserService.prototype.update = function () {
        var _this = this;
        this.data$.subscribe(function (user) {
            _this.userChange$.next(user);
        }, function () {
            _this.destroy();
        });
    };
    UserService.prototype.destroy = function () {
        this.userChange$.next({
            identifier: null,
            nickname: null,
            roles: new Array()
        });
    };
    Object.defineProperty(UserService.prototype, "userSync", {
        get: function () {
            var _this = this;
            return this.userChange$
                .asObservable()
                .pipe(operators_1.skipWhile(function (_a) {
                var identifier = _a.identifier;
                return !identifier && _this.loggedIn;
            }));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserService.prototype, "logged", {
        get: function () {
            return !!this.userChange$.getValue().identifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserService.prototype, "getId", {
        get: function () {
            return this.userChange$.getValue().identifier;
        },
        enumerable: false,
        configurable: true
    });
    UserService.prototype.isEqualTo = function (_id) {
        return this.userChange$.getValue().identifier === _id;
    };
    Object.defineProperty(UserService.prototype, "getNickname", {
        get: function () {
            return this.userChange$.getValue().nickname;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UserService.prototype, "getRoles", {
        get: function () {
            return this.userChange$.getValue().roles;
        },
        enumerable: false,
        configurable: true
    });
    UserService.prototype.hasRole = function (roles) {
        var currentRoles = this.userChange$.getValue().roles;
        return Array.isArray(roles)
            ? roles.some(function (r) { return currentRoles.includes(r); })
            : currentRoles.includes(roles);
    };
    UserService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __param(4, core_1.Inject(core_1.PLATFORM_ID))
    ], UserService);
    return UserService;
}(services_1.AuthService));
exports.UserService = UserService;
