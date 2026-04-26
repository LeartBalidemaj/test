import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  findAll() { return this.tenantsService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.tenantsService.findOne(+id); }

  @Post()
  create(@Body() body: { name: string; slug: string; email: string }) {
    return this.tenantsService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.tenantsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.tenantsService.remove(+id); }
}