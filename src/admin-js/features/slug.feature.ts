import {
  ActionResponse,
  After,
  Before,
  buildFeature,
  FeatureType,
} from 'adminjs';
import slugify from 'slugify';

export type SlugOptions = {
  source: string;
  destination: string;
};

const slugFeature = (options: SlugOptions): FeatureType => {
  const { source, destination } = options;

  const slugBefore: Before = async (request) => {
    const { method } = request;
    const {
      [source]: sourceValue,
      [destination]: destinationValue,
      ...rest
    } = request.payload || {};

    // @ts-ignore
    let finalSlug = slugify(sourceValue);
    if (destinationValue) {
      // @ts-ignore
      finalSlug = slugify(destinationValue);
    }

    if (method === 'post' && sourceValue) {
      return {
        ...request,
        payload: {
          ...rest,
          [source]: sourceValue,
          [destination]: finalSlug,
        },
      };
    }
    return request;
  };

  const moveSlugErrors: After<ActionResponse> = async (response) => {
    if (
      response.record &&
      response.record.errors &&
      response.record.errors[destination]
    ) {
      response.record.errors[source] = response.record.errors[destination];
    }
    return response;
  };

  return buildFeature({
    actions: {
      new: {
        before: [slugBefore],
        after: [moveSlugErrors],
      },
    },
  });
};

export default slugFeature;
