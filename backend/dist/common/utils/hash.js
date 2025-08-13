"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.md5 = md5;
const crypto_1 = __importDefault(require("crypto"));
function md5(input) {
    return crypto_1.default.createHash('md5').update(input).digest('hex');
}
//# sourceMappingURL=hash.js.map