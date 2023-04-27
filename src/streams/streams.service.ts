import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

import { getModel } from '../apis/apis.service.js';

@Injectable()
export class StreamsService {
  changeStreamEmitter = new EventEmitter();

  async findSchema(modelName) {
    const { schema, model } = await getModel(modelName);
    const changeStream = schema.watch();
    changeStream.on('change', (next) => {
      this.changeStreamEmitter.emit('change', next);
    });
    return true;
  }
}
