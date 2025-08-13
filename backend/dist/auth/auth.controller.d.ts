import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
export declare class AuthController {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(dto: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(res: Response): Promise<Response<any, Record<string, any>>>;
    me(req: Request): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        name: string | null;
        avatarUrl: string | null;
    } | null>;
    private issueTokens;
}
