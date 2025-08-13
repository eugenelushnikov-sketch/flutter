import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

class UpdateRoleDto {
  @IsEnum(Role)
  role!: Role;
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get(':id')
  getOne(@Param('id') id: string, @Req() req: any) {
    const requester = req.user as { sub: string; role: string };
    if (requester.role !== 'ADMIN' && requester.sub !== id) {
      return { statusCode: 403, message: 'Forbidden' };
    }
    return this.users.findById(id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.users.deleteById(id);
  }

  @Patch(':id/role')
  @Roles('ADMIN')
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.users.updateRole(id, dto.role);
  }
}