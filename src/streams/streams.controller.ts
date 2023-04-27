import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { StreamsService } from './streams.service.js';
import { ApiTags } from '@nestjs/swagger';

const publicAPIConst = 'public';

@ApiTags('streams')
@Controller('streams')
export class StreamsController {
  constructor(private readonly streamsService: StreamsService) {}

  @Get(`${publicAPIConst}/:modelName`)
  async getSchema(@Param('modelName') modelName: string) {
    return this.streamsService.findSchema(modelName);
  }
}
