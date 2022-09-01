"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
/**
 * MIDDLEWARE
 * @return {express.Handler}
 */
function default_1() {
    return function (req, res, next) {
        req.whereBuilder = (...keys) => {
            if (Array.isArray(keys[0])) {
                keys = keys[0];
            }
            return (0, index_1.default)(req.query, keys);
        };
        next();
    };
}
exports.default = default_1;
