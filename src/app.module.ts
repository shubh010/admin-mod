import { Module } from '@nestjs/common';
import { AdminJsModule } from './admin-js/admin-js.module.js';
import { DatabaseModule } from './database/database.module.js';
import { ApisModule } from './apis/apis.module.js';
import { StreamsModule } from './streams/streams.module.js';
import { WebsocketsModule } from './websockets/websockets.module.js';

@Module({
  imports: [
    AdminJsModule,
    DatabaseModule,
    ApisModule,
    StreamsModule,
    WebsocketsModule,
  ],
})
export class AppModule {}
