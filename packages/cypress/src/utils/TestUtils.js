"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIsPreciousPlastic = exports.generateNewUserDetails = exports.DbCollectionName = exports.generateAlphaNumeric = exports.Page = void 0;
var Page;
(function (Page) {
    Page["HOWTO"] = "/how-to";
    Page["ACADEMY"] = "/academy";
    Page["SETTINGS"] = "/settings";
})(Page || (exports.Page = Page = {}));
var generateAlphaNumeric = function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generateAlphaNumeric = generateAlphaNumeric;
var DbCollectionName;
(function (DbCollectionName) {
    DbCollectionName["users"] = "users";
    DbCollectionName["howtos"] = "howtos";
})(DbCollectionName || (exports.DbCollectionName = DbCollectionName = {}));
var generateNewUserDetails = function () {
    return {
        username: "CI_".concat((0, exports.generateAlphaNumeric)(5)).toLocaleLowerCase(),
        email: "CI_".concat((0, exports.generateAlphaNumeric)(5), "@test.com").toLocaleLowerCase(),
        password: 'test1234',
    };
};
exports.generateNewUserDetails = generateNewUserDetails;
var setIsPreciousPlastic = function () {
    return localStorage.setItem('platformTheme', 'precious-plastic');
};
exports.setIsPreciousPlastic = setIsPreciousPlastic;
