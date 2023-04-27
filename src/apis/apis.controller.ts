import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApisService } from './apis.service.js';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard.js';
import { Request } from 'express';

const publicAPIConst = 'public';
const selfAPIConst = 'self';
const queryAPIConst = 'query';
const authAPIConst = 'auth';

@ApiTags('apis')
@Controller('apis')
export class ApisController {
  constructor(private readonly apisService: ApisService) {}

  @Get(`${publicAPIConst}/:modelName`)
  async getSchema(
    @Param('modelName') modelName: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Req() req: Request,
  ) {
    return this.apisService.findSchema(modelName, page, limit);
  }

  @Get(`${publicAPIConst}/:modelName/:id`)
  async findOne(
    @Param('modelName') modelName: string,
    @Param('id') id: string,
  ) {
    return this.apisService.findOne(modelName, id);
  }

  @Post(`${publicAPIConst}/:modelName`)
  async create(@Param('modelName') modelName: string, @Body() data: any) {
    return this.apisService.create(modelName, data);
  }

  @Put(`${publicAPIConst}/:modelName/:id`)
  async update(
    @Param('modelName') modelName: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.apisService.update(modelName, id, data);
  }

  @Delete(`${publicAPIConst}/:modelName/:id/delete`)
  async delete(@Param('modelName') modelName: string, @Param('id') id: string) {
    return this.apisService.delete(modelName, id);
  }

  @Post(`${authAPIConst}/:modelName`)
  async authenticate(
    @Param('modelName') modelName: string,
    @Body() credentials: any,
  ) {
    return this.apisService.authenticateService(modelName, credentials);
  }

  @UseGuards(AuthGuard)
  @Get(`${selfAPIConst}/:modelName`)
  async getSelfSchema(
    @Param('modelName') modelName: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Req() req: Request,
  ) {
    return this.apisService.findSelfSchema(
      modelName,
      req['user'],
      null,
      page,
      limit,
    );
  }

  @UseGuards(AuthGuard)
  @Get(`${selfAPIConst}/:modelName/:id`)
  async findOneSelf(
    @Param('modelName') modelName: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.apisService.findSelfSchema(modelName, req['user'], id);
  }

  @UseGuards(AuthGuard)
  @Post(`${selfAPIConst}/:modelName`)
  async createSelf(
    @Param('modelName') modelName: string,
    @Req() req: Request,
    @Body() data: any,
  ) {
    return this.apisService.createSelf(modelName, data, req['user']);
  }

  @UseGuards(AuthGuard)
  @Put(`${selfAPIConst}/:modelName/:id`)
  async updateSelf(
    @Param('modelName') modelName: string,
    @Param('id') id: string,
    @Req() req: Request,
    @Body() data: any,
  ) {
    return this.apisService.updateSelf(modelName, id, data, req['user']);
  }

  @UseGuards(AuthGuard)
  @Delete(`${selfAPIConst}/:modelName/:id/delete`)
  async deleteSelf(
    @Param('modelName') modelName: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.apisService.deleteSelf(modelName, id, req['user']);
  }

  @Post(`${queryAPIConst}/:modelName`)
  async customQuery(
    @Param('modelName') modelName: string,
    @Req() req: Request,
    @Body() data: any,
  ) {
    return this.apisService.customQuery(modelName, req, data);
  }
}
