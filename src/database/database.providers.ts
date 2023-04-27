import * as mongoose from 'mongoose';
import { constants } from '../const.js';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> => mongoose.connect(constants.db),
  },
];
