import { Module } from '@nestjs/common';
import { StreamsService } from './streams.service.js';
import { StreamsController } from './streams.controller.js';

@Module({
  controllers: [StreamsController],
  providers: [StreamsService],
})
export class StreamsModule {}
