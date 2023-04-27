import { model, Schema } from 'mongoose';

export interface AdminUser {
  email: string;
  password: string;
  permissions: Schema.Types.Array;
}

export const AdminUserSchema = new Schema<AdminUser>({
  email: { type: Schema.Types.String, required: true },
  password: { type: Schema.Types.String },
  permissions: {
    type: Schema.Types.Array,
  },
});

export const AdminUser = model<AdminUser>('Log', AdminUserSchema);
