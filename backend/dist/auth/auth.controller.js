"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
}
let AuthController = class AuthController {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto, res) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists)
            return res.status(400).json({ message: 'Email already used' });
        const passwordHash = await bcryptjs_1.default.hash(dto.password, 10);
        const user = await this.prisma.user.create({ data: { email: dto.email, passwordHash, name: dto.name } });
        const tokens = this.issueTokens(user.id, user.role);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        return res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
    }
    async login(dto, res) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        const ok = await bcryptjs_1.default.compare(dto.password, user.passwordHash);
        if (!ok)
            return res.status(401).json({ message: 'Invalid credentials' });
        const tokens = this.issueTokens(user.id, user.role);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        return res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
    }
    async refresh(req, res) {
        const refresh = req.cookies?.refresh_token;
        if (!refresh)
            return res.status(401).json({ message: 'No refresh token' });
        try {
            const payload = this.jwt.verify(refresh, { secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh' });
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user)
                return res.status(401).json({ message: 'Invalid refresh token' });
            const tokens = this.issueTokens(user.id, user.role);
            setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
            return res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
        }
        catch (e) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }
    }
    async logout(res) {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.json({ ok: true });
    }
    async me(req) {
        const user = req.user;
        const db = await this.prisma.user.findUnique({ where: { id: user.sub } });
        if (!db)
            return null;
        return { id: db.id, email: db.email, role: db.role, name: db.name, avatarUrl: db.avatarUrl };
    }
    issueTokens(sub, role) {
        const accessToken = this.jwt.sign({ sub, role }, { secret: process.env.JWT_ACCESS_SECRET || 'dev_access', expiresIn: '15m' });
        const refreshToken = this.jwt.sign({ sub, role }, { secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh', expiresIn: '7d' });
        return { accessToken, refreshToken };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map