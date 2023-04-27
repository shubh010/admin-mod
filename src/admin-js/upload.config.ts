import uploadFeature from '@adminjs/upload';
import { File } from '../schemas/file.schema.js';
import { componentLoader } from './component.loader.js';

export const AWScredentials = {
  accessKeyId: 'AKIAQDEENMG732VTIBP2',
  secretAccessKey: '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',
  region: 'eu-west-2',
  bucket: 'quikbook',
};

export const uploads = {
  resource: File,
  options: {
    navigation: { name: 'Settings', icon: 'Settings' },
    properties: {
      s3Key: {
        type: 'string',
      },
      bucket: {
        type: 'string',
      },
      mime: {
        type: 'string',
      },
      comment: {
        type: 'textarea',
        isSortable: false,
      },
    },
  },
  features: [
    uploadFeature({
      componentLoader,
      provider: {
        aws: { ...AWScredentials },
      },
      properties: {
        file: 'uploadedFile',
        filePath: 'path',
        filesToDelete: 'filesToDelete',
        key: 's3Key',
      },

      validation: {
        mimeTypes: ['image/png', 'application/pdf', 'audio/mpeg'],
      },
    }),
  ],
};
