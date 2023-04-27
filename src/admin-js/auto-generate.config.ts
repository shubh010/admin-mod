import importExportFeature from '@adminjs/import-export';
import passwordsFeature from '@adminjs/passwords';
import Types, { Schema, model } from 'mongoose';
import loggerFeature from '@adminjs/logger';
import { ModelGroup } from '../schemas/model-group.schema.js';
import { Model } from '../schemas/model-schema.js';
import uploadFeature from '@adminjs/upload';
import { AWScredentials } from './upload.config.js';
import { componentLoader } from './component.loader.js';
import bcrypt from 'bcryptjs';
import { LogModel } from '../schemas/Log.schema.js';
import slugFeature from './features/slug.feature.js';
import notificationFeature from './features/notification.feature.js';

// const bcrypt = require('bcryptjs');

const getMimeTypes = (type: string) => {
  let mimeTypes = [];
  switch (type) {
    case 'image':
      mimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/webp',
        'image/svg+xml',
      ];
      break;
    case 'video':
      mimeTypes = [
        'video/mp4',
        'video/quicktime',
        'video/mpeg',
        'video/x-ms-wmv',
        'video/x-msvideo',
        'video/webm',
      ];
      break;
    case 'audio':
      mimeTypes = [
        'audio/mpeg',
        'audio/wav',
        'audio/mp3',
        'audio/ogg',
        'audio/x-ms-wma',
      ];
      break;
    case 'application':
      mimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ];
      break;
  }
  return mimeTypes;
};

export const getAllModels = async () => {
  const models = await Model.aggregate([
    {
      $lookup: {
        from: 'modelgroups',
        localField: 'group',
        foreignField: '_id',
        as: 'groups',
      },
    },
    {
      $project: {
        model_name: 1,
        fields: 1,
        'groups.name': 1,
        'groups.icon': 1,
        more_data: 1,
      },
    },
  ]);
  return models;
};

export const getAutoGenerateResources = async ({
  logging,
}: {
  logging: boolean;
}) => {
  const models = await getAllModels();

  const resourcesSchema = generateSchemas(models);
  console.log(resourcesSchema);

  const refs = models.map((item) => {
    return { value: item.model_name, label: item.model_name };
  });

  const resources = resourcesSchema.map((model, index) => {
    const features = [
      importExportFeature({ componentLoader }),
      notificationFeature(),
    ];

    if (logging) {
      features.push(
        loggerFeature({
          componentLoader,
          propertiesMapping: {
            user: 'userId',
          },
          userIdAttribute: 'id',
        }),
      );
    }

    const properties = {};
    const listProperties = [];
    const showProperties = [];

    // use the dynamicKey to set the field options

    models[index].fields.map((field) => {
      properties[field.field_name] = {
        description: field?.description,
      };

      if (!field.is_multiple_files) {
        listProperties.push(field.field_name);
        showProperties.push(field.field_name);

        if (field.is_hashed) {
          const index = listProperties.indexOf(field.field_name);
          if (index > -1) {
            listProperties.splice(index, 1);
            showProperties.splice(index, 1);
          }
        }
      }

      if (field.is_rich_text) properties[field.field_name].type = 'richtext';
      if (field?.options?.length > 0)
        properties[field.field_name].availableValues = field?.options.map(
          (item) => ({ value: item, label: item }),
        );
      if (field?.is_hashed) {
        properties[field.field_name].isVisible = false;

        const filedName = field.field_name;
        const props = {
          encryptedPassword: filedName,
        };
        props[filedName] = filedName + 'Hashed';
        features.push(
          passwordsFeature({
            componentLoader,
            properties: props,
            hash: bcrypt.hashSync,
          }),
        );
      }

      if (field?.is_slug) {
        // console.log(models[index].fields[0].field_name);
        features.push(
          slugFeature({
            destination: field.field_name,
            source: models[index].fields[0].field_name,
          }),
        );
      }

      if (field?.is_file) {
        properties[field.field_name].isVisible = false;
        properties[field.field_name].isArray = field.is_multiple_files
          ? field.is_multiple_files
          : false;
        const filedName = field.field_name;
        let mimeTypes = getMimeTypes(field.file_type);

        features.push(
          uploadFeature({
            componentLoader,
            provider: {
              aws: AWScredentials,
            },
            multiple: field.is_multiple_files ? field.is_multiple_files : false,
            properties: {
              file: filedName + 'File',
              filePath: filedName + 'path',
              filesToDelete: filedName + 'filesToDelete',
              key: filedName,
            },
            validation: {
              mimeTypes: mimeTypes,
            },
          }),
        );
      }
    });

    return {
      resource: model,
      options: {
        sort: {
          sortBy: 'createdAt',
          direction: 'desc',
        },
        navigation: {
          name: models[index].groups[0]?.name,
          icon: models[index].groups[0]?.icon,
        },
        properties,
        listProperties: [...listProperties, 'createdAt', 'updatedAt'],
        showProperties: [...showProperties, 'createdAt', 'updatedAt'],
        actions: {
          //   list: {
          //     isAccessible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //     isVisible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //   },
          //   edit: {
          //     isAccessible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //     isVisible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //   },
          //   new: {
          //     isAccessible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //     isVisible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //   },
          //   delete: {
          //     isAccessible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //     isVisible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //   },
          //   filter: {
          //     isAccessible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //     isVisible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //   },
          //   search: {
          //     isAccessible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //     isVisible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //   },
          //   show: {
          //     isAccessible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //     isVisible: ({ currentAdmin }) =>
          //       currentAdmin.email === DEFAULT_ADMIN.email,
          //   },
          //   myCustomAction: {
          //     actionType: 'record',
          //     component: false,
          //     handler: (request, response, context) => {
          //       const { record, currentAdmin } = context;
          //       return {
          //         record: record.toJSON(currentAdmin),
          //         msg: 'Hello world',
          //       };
          //     },
          //   },
        },
      },
      features: features,
    };
  });

  const autoGenerateModelResources = [
    {
      resource: ModelGroup,
      options: {
        navigation: { name: 'Settings', icon: 'Settings' },
        actions: {
          list: {
            isVisible: true,
            isAccessible: true,
          },
          myCustomAction: {
            actionType: 'record',
            component: false,
            handler: (request, response, context) => {
              const { record, currentAdmin } = context;

              return {
                record: record.toJSON(currentAdmin),
                msg: 'Hello world',
              };
            },
          },
        },
      },
    },
    {
      resource: Model,
      options: {
        navigation: { name: 'Settings', icon: 'Gear' },
        properties: {
          'fields.ref': {
            availableValues: refs,
          },
        },

        listProperties: ['_id', 'model_name', 'fields', 'createdAt'],

        actions: {
          list: {
            isVisible: true,
            isAccessible: true,
          },
          myCustomAction: {
            actionType: 'record',
            component: false,
            handler: (request, response, context) => {
              const { record, currentAdmin } = context;

              return {
                record: record.toJSON(currentAdmin),
                msg: 'Hello world',
              };
            },
          },
        },
      },
    },
    {
      resource: LogModel,
      options: {
        navigation: { name: 'Settings', icon: 'Gear' },
      },
    },
  ];
  return { autoGenerateModelResources, resources };
};

export const generateSchemas = (models) => {
  const schemas = [];

  for (const item of models) {
    // Check if schema already exists
    const existingSchema = Types.connection.models[item.model_name];
    if (existingSchema) {
      schemas.push(existingSchema);
      continue;
    }

    const schemaFields = {};
    for (const field of item.fields) {
      // use the dynamicKey to set the field options

      if (field.ref)
        schemaFields[field.field_name] = {
          type: Schema.Types.ObjectId,
          ref: field.ref,
          unique: field.unique,
          required: field.required,
        };
      else
        schemaFields[field.field_name] = {
          type: field.data_type ? field.data_type : Schema.Types.String,
          unique: field.unique,
          required: field.required,
        };
    }

    const moreDataSchemaFields = {};
    let ModelSchema;

    if (item?.more_data?.length > 0) {
      for (const field of item.more_data) {
        // use the dynamicKey to set the field options

        if (field.ref)
          moreDataSchemaFields[field.field_name] = {
            type: Schema.Types.ObjectId,
            ref: field.ref,

            required: field.required,
          };
        else
          moreDataSchemaFields[field.field_name] = {
            type: field.data_type,

            required: field.required,
          };
      }

      ModelSchema = new Schema(
        { ...schemaFields, data: [moreDataSchemaFields] },
        { timestamps: true },
      );
    } else {
      ModelSchema = new Schema({ ...schemaFields }, { timestamps: true });
    }
    const modelInstance = model(item.model_name, ModelSchema);
    schemas.push(modelInstance);
  }

  return schemas;
};
