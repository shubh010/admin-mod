import { Injectable, NotFoundException } from '@nestjs/common';
import { getModel } from '../apis/apis.service.js';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WebsocketsService {
  private changeStreams = {};

  async emitChange(modelName: any, server: Server, socket: Socket) {
    const { schema, model } = await getModel(modelName);
    if (!schema) {
      return server.emit('error', `Schema for model "${modelName}" not found`);
    }

    // Store the change stream for this model name and socket id
    const socketId = socket.id;
    if (!this.changeStreams[modelName]) {
      this.changeStreams[modelName] = {};
    }
    if (this.changeStreams[modelName][socketId]) {
      this.changeStreams[modelName][socketId].close();
    }
    const changeStream = schema.watch();
    this.changeStreams[modelName][socketId] = changeStream;

    // Listen for changes and emit to the socket with the matching id
    changeStream.on('change', (next) => {
      socket.emit(modelName, next);
    });
  }

  async closeConnection(modelName: any, socket: Socket) {
    const { schema, model } = await getModel(modelName);
    if (!schema) {
      return socket.emit('error', `Schema for model "${modelName}" not found`);
    }

    // Close the change stream for this model name and socket id
    const socketId = socket.id;
    if (
      this.changeStreams[modelName] &&
      this.changeStreams[modelName][socketId]
    ) {
      this.changeStreams[modelName][socketId].close();
      delete this.changeStreams[modelName][socketId];
    }
  }
}
