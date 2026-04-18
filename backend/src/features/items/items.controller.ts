import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto } from './item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll() { return this.itemsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.itemsService.findOne(id); }

  @Post()
  create(@Body() dto: CreateItemDto, @Request() req: any) { return this.itemsService.create(dto, req.user.id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) { return this.itemsService.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.itemsService.remove(id); }
}
