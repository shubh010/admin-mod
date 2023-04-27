import { model, Schema, Types } from 'mongoose';

export interface IModelGroup {
  name: Schema.Types.String;
  icon: Schema.Types.String;
}

export const ModelGroupSchema = new Schema<IModelGroup>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      max: 50,
      unique: true,
    },

    icon: {
      type: Schema.Types.String,
      required: true,
      max: 50,
      unique: true,
    },
  },
  { timestamps: true },
);

export const ModelGroup = model<IModelGroup>('ModelGroup', ModelGroupSchema);
