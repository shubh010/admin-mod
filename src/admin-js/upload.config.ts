import uploadFeature from '@adminjs/upload';
import { File } from '../schemas/file.schema.js';
import { componentLoader } from './component.loader.js';

export const AWScredentials = {
  accessKeyId: '', // Your AWS Access Key
  secretAccessKey: '', // Your AWS Secret Access Key
  region: '', // Your AWS account region
  bucket: '', // Your AWS bucket name
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
