"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = void 0;
require("dotenv/config");
const setCookie = (res, cookieName, token) => {
    res.cookie(cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
    });
};
exports.setCookie = setCookie;
