import { model, Schema } from 'mongoose';

export interface Log {
  id: number;
  action: string;
  resource: string;
  userId: string | null;
  recordId: string;
  recordTitle: string | null;
  difference: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt?: Date;
}

export const LogSchema = new Schema<Log>({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  recordId: { type: 'String', required: true },
  recordTitle: { type: 'String' },
  difference: 'Object',
  action: { type: 'String' },
  resource: { type: 'String' },
  userId: { type: 'String' },
});

export const LogModel = model<Log>('Log', LogSchema);
