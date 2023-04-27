import { model, Schema, Types } from 'mongoose';

export interface IFileModel {
  s3Key: string;
  bucket: string;
  mime: string;
  comment: string | null;
}
export const FileSchema = new Schema<IFileModel>(
  {
    s3Key: {
      type: Schema.Types.String,
    },

    bucket: {
      type: Schema.Types.String,
      default: 'quikbook',
    },
    mime: {
      type: Schema.Types.String,
    },
    comment: {
      type: Schema.Types.String,
    },
  },
  { timestamps: true },
);

export const File = model<IFileModel>('File', FileSchema);
