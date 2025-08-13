import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  listForUser(userId: string) {
    return this.prisma.favorite.findMany({ where: { userId }, include: { unit: true } });
  }

  async add(userId: string, unitId: string) {
    try {
      return await this.prisma.favorite.create({ data: { userId, unitId } });
    } catch (e) {
      throw new BadRequestException('Already in favorites or invalid unit');
    }
  }

  remove(userId: string, unitId: string) {
    return this.prisma.favorite.delete({ where: { userId_unitId: { userId, unitId } } });
  }
}