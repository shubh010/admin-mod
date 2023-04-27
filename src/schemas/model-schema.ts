import { model, Schema, Types } from 'mongoose';

export interface IModel {
  model_name: Schema.Types.String;
  group: Schema.Types.String;
  fields: [{ type: Schema }];
  more_data: [{ type: Schema }];
  rest_permissions: {
    edit: Schema.Types.String;
    list: Schema.Types.String;
    new: Schema.Types.String;
    search: Schema.Types.String;
    show: Schema.Types.String;
    delete: Schema.Types.String;
  };
}

export interface IFields {
  field_name: Schema.Types.String;
  data_type: Schema.Types.String | Schema.Types.ObjectId;
}

export const ModelSchema = new Schema<IModel>(
  {
    model_name: {
      type: Schema.Types.String,
      required: true,
      max: 50,
      unique: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'ModelGroup',
    },
    fields: [
      {
        unique: {
          type: Schema.Types.Boolean,
          default: false,
        },
        is_slug: {
          type: Schema.Types.Boolean,
          default: false,
        },
        field_name: {
          type: Schema.Types.String,
          required: true,
        },
        data_type: {
          type: Schema.Types.String,
          enum: Object.keys(Schema.Types),
          default: Schema.Types.String,
          required: true,
        },
        is_file: {
          type: Schema.Types.Boolean,
          default: false,
        },
        is_multiple_files: {
          type: Schema.Types.Boolean,
          default: false,
        },
        file_type: {
          type: Schema.Types.String,
          enum: ['image', 'application', 'audio', 'video', 'all'],
        },
        use_for_authentication: { type: Schema.Types.Boolean, default: false },
        ref: {
          type: Schema.Types.String,
        },
        primary_ref: {
          type: Schema.Types.Boolean,
          default: false,
        },
        is_rich_text: {
          type: Schema.Types.Boolean,
          default: false,
        },
        description: {
          type: Schema.Types.String,
        },
        options: [Schema.Types.String],
        required: {
          type: Schema.Types.Boolean,
          default: true,
        },
        is_hashed: {
          type: Schema.Types.Boolean,
          default: false,
        },
      },
    ],

    more_data: [
      {
        field_name: {
          type: Schema.Types.String,
          required: true,
        },
        data_type: {
          type: Schema.Types.String,
          enum: Object.keys(Schema.Types),
        },
        ref: {
          type: Schema.Types.String,
        },

        is_rich_text: {
          type: Schema.Types.Boolean,
          default: false,
        },
        description: {
          type: Schema.Types.String,
        },
        options: [Schema.Types.String],
        required: {
          type: Schema.Types.Boolean,
          default: true,
        },
        is_hashed: {
          type: Schema.Types.Boolean,
          default: false,
        },
      },
    ],

    rest_permissions: {
      list: {
        type: Schema.Types.String,
        default: 'YES',
        enum: ['YES', 'NO', 'AUTHENTICATE_USER'],
      },
      show: {
        type: Schema.Types.String,
        default: 'YES',
        enum: ['YES', 'NO', 'AUTHENTICATE_USER'],
      },
      edit: {
        type: Schema.Types.String,
        default: 'NO',
        enum: ['YES', 'NO', 'AUTHENTICATE_USER'],
      },

      delete: {
        type: Schema.Types.String,
        default: 'NO',
        enum: ['YES', 'NO', 'AUTHENTICATE_USER'],
      },
      new: {
        type: Schema.Types.String,
        default: 'NO',
        enum: ['YES', 'NO', 'AUTHENTICATE_USER'],
      },
      search: {
        type: Schema.Types.String,
        default: 'NO',
        enum: ['YES', 'NO', 'AUTHENTICATE_USER'],
      },
    },
  },
  { timestamps: true },
);

export const Model = model<IModel>('Model', ModelSchema);
