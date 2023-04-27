import {
  ActionResponse,
  After,
  Before,
  buildFeature,
  FeatureType,
} from 'adminjs';
import slugify from 'slugify';

const notificationFeature = (): FeatureType => {
  const afterRecordSave: After<ActionResponse> = async (response) => {
    return response;
  };

  return buildFeature({
    actions: {
      edit: {
        after: [afterRecordSave],
      },
    },
  });
};

export default notificationFeature;
