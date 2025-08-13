import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('USER')
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get('me/favorites')
  list(@Req() req: any) {
    return this.favorites.listForUser(req.user.sub);
  }

  @Post('favorites/:unitId')
  add(@Req() req: any, @Param('unitId') unitId: string) {
    return this.favorites.add(req.user.sub, unitId);
  }

  @Delete('favorites/:unitId')
  remove(@Req() req: any, @Param('unitId') unitId: string) {
    return this.favorites.remove(req.user.sub, unitId);
  }
}