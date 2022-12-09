"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EnvVars_1 = __importDefault(require("@configurations/EnvVars"));
const HttpStatusCodes_1 = __importDefault(require("@configurations/HttpStatusCodes"));
const userServices = __importStar(require("@services/user-service"));
const paths = {
    basePath: '/users',
    profile: '/profile',
    signup: '/signup',
    signout: '/signout',
    signin: '/signin',
    jwt: '/jwt',
    update: '/profile',
    delete: '/profile',
};
function getProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authData = req.app.locals.auth;
        const user = yield userServices.getProfile(authData.id);
        return res.status(HttpStatusCodes_1.default.OK).json(user);
    });
}
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield userServices.signup(req.body);
        const { key, options } = EnvVars_1.default.cookieProps;
        res.cookie(key, result.token, options);
        return res.status(HttpStatusCodes_1.default.OK).json({
            id: result.id,
            name: result.name,
            email: result.email,
        });
    });
}
function update(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authData = req.app.locals.auth;
        yield userServices.update(authData.id, req.body);
        return res.status(HttpStatusCodes_1.default.NO_CONTENT).send();
    });
}
function _delete(req, res) {
    return res.status(HttpStatusCodes_1.default.NO_CONTENT).send();
}
function signin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield userServices.signin(req.body);
        if (!result) {
            return res.status(HttpStatusCodes_1.default.BAD_REQUEST).json('Please provided username and password');
        }
        if (!result.id) {
            return res.status(HttpStatusCodes_1.default.UNAUTHORIZED).json('Invalid user');
        }
        const { key, options } = EnvVars_1.default.cookieProps;
        res.cookie(key, result.token, options);
        return res.status(HttpStatusCodes_1.default.OK).json({
            id: result.id,
            name: result.name,
            email: result.email,
        });
    });
}
function signout(req, res) {
    const { key } = EnvVars_1.default.cookieProps;
    res.clearCookie(key);
    return res.status(HttpStatusCodes_1.default.NO_CONTENT).send();
}
function getUserFromToken(req, res) {
    const authData = req.app.locals.auth;
    return res.status(HttpStatusCodes_1.default.OK).json({
        id: authData.id,
        name: authData.name,
        email: authData.email,
    });
}
exports.default = {
    paths,
    getProfile,
    getUserFromToken,
    signin,
    signout,
    signup,
    update,
    delete: _delete,
};