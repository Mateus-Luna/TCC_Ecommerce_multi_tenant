import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { MasterService } from './master.service';
import { CreateStoreDto } from '../stores/stores/dto/create-store.dto';
import { UpdateStoreDto } from '../stores/stores/dto/update-store.dto';

class MasterStoreDto extends CreateStoreDto { @IsOptional() @IsArray() adminIds?: string[]; }
class MasterUpdateStoreDto extends UpdateStoreDto { @IsOptional() @IsArray() adminIds?: string[]; }
class AdminDto { @IsEmail() email!: string; @IsString() @MinLength(6) password!: string; }
class UpdateAdminDto { @IsOptional() @IsEmail() email?: string; @IsOptional() @IsString() @MinLength(6) password?: string; }
class AssignAdminDto { @IsOptional() @IsString() storeId?: string | null; }

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('MASTER_ADMIN')
@Controller('master')
export class MasterController {
  constructor(private readonly service: MasterService) {}
  @Get('stores') listStores() { return this.service.listStores(); }
  @Post('stores') createStore(@Body() dto: MasterStoreDto) { return this.service.createStore(dto); }
  @Patch('stores/:id') updateStore(@Param('id') id: string, @Body() dto: MasterUpdateStoreDto) { return this.service.updateStore(id, dto); }
  @Delete('stores/:id') removeStore(@Param('id') id: string) { return this.service.removeStore(id); }
  @Get('admins') listAdmins(@Query('available') available?: string) { return this.service.listAdmins(available === 'true'); }
  @Post('admins') createAdmin(@Body() dto: AdminDto) { return this.service.createAdmin(dto); }
  @Patch('admins/:id') updateAdmin(@Param('id') id: string, @Body() dto: UpdateAdminDto) { return this.service.updateAdmin(id, dto); }
  @Patch('admins/:id/store') assignAdmin(@Param('id') id: string, @Body() dto: AssignAdminDto) { return this.service.assignAdmin(id, dto.storeId ?? null); }
}
