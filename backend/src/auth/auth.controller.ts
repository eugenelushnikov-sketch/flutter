import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('access_token', accessToken, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
  res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
}

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) return res.status(400).json({ message: 'Email already used' });
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { email: dto.email, passwordHash, name: dto.name } });
    const tokens = this.issueTokens(user.id, user.role);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const tokens = this.issueTokens(user.id, user.role);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refresh = (req as any).cookies?.refresh_token;
    if (!refresh) return res.status(401).json({ message: 'No refresh token' });
    try {
      const payload: any = this.jwt.verify(refresh, { secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh' });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) return res.status(401).json({ message: 'Invalid refresh token' });
      const tokens = this.issueTokens(user.id, user.role);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      return res.json({ id: user.id, email: user.email, role: user.role, name: user.name });
    } catch (e) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.json({ ok: true });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    const user: any = (req as any).user;
    const db = await this.prisma.user.findUnique({ where: { id: user.sub } });
    if (!db) return null;
    return { id: db.id, email: db.email, role: db.role, name: db.name, avatarUrl: db.avatarUrl };
  }

  private issueTokens(sub: string, role: string) {
    const accessToken = this.jwt.sign({ sub, role }, { secret: process.env.JWT_ACCESS_SECRET || 'dev_access', expiresIn: '15m' });
    const refreshToken = this.jwt.sign({ sub, role }, { secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh', expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
}