import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UpdateStoreDto } from './dto/update-store.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreService } from './stores.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('store')
export class StoreController {
    constructor(private readonly storesService: StoreService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER_ADMIN')
  @Post()
  create(@Body() dto: CreateStoreDto) {
    return this.storesService.create(dto);
  }

  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER_ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
  ) {
    return this.storesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MASTER_ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/banner')
  updateBanner(@Param('id') id: string, @Body('bannerUrl') bannerUrl: string | null, @Req() req: any) {
    return this.storesService.updateBanner(id, req.user.storeId, bannerUrl);
  }
}
