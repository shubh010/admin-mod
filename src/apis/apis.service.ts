import { Injectable } from '@nestjs/common';
import { Model } from '../schemas/model-schema.js';
import { JwtService } from '@nestjs/jwt';
import { generateSchemas } from '../admin-js/auto-generate.config.js';
import {
  authenticateUser,
  createOneFromPublicApis,
  createSelfRec,
  customQueryCURD,
  deleteFromPublicApis,
  deleteSelf,
  findOneFromPublicApis,
  paginatedFind,
  selfFind,
  updateOneFromPublicApis,
  updateSelf,
} from './apis.curd.js';
import {
  checkPublicApisPermissions,
  checkSelfApisPermissions,
} from './apis.permissions.js';

const cache = {};

export const getModel = async (modelName: any) => {
  if (cache[modelName]) {
    return cache[modelName];
  }

  const models = await Model.aggregate([
    {
      $match: {
        model_name: modelName,
      },
    },
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
        rest_permissions: 1,
        more_data: 1,
      },
    },
  ]);

  const resourcesSchema = generateSchemas(models);
  const schema = resourcesSchema.find((model) => model.modelName === modelName);
  const model = models.find((model) => model.model_name === modelName);
  const result = { schema, model };
  cache[modelName] = result;
  return result;
};

@Injectable()
export class ApisService {
  constructor(private jwtService: JwtService) {}

  async findSchema(modelName: string, page = 1, limit = 20) {
    const { schema, model } = await getModel(modelName);
    checkPublicApisPermissions(
      schema,
      model?.rest_permissions?.list,
      modelName,
    );
    const result = await paginatedFind(schema, modelName, model, page, limit);
    return result;
  }

  async findOne(modelName: string, id: string) {
    const { schema, model } = await getModel(modelName);
    checkPublicApisPermissions(
      schema,
      model?.rest_permissions?.show,
      modelName,
    );
    const result = await findOneFromPublicApis({ schema, model, id });
    return result;
  }

  async create(modelName: string, data: any) {
    const { schema, model } = await getModel(modelName);
    checkPublicApisPermissions(schema, model?.rest_permissions?.new, modelName);
    const result = await createOneFromPublicApis({
      data,
      schema,
      model,
    });
    return result;
  }

  async update(modelName: string, id: string, data: any) {
    const { schema, model } = await getModel(modelName);
    checkPublicApisPermissions(
      schema,
      model?.rest_permissions?.edit,
      modelName,
    );
    return await updateOneFromPublicApis({
      schema,
      model,
      data,
      id,
    });
  }

  async delete(modelName: string, id: string) {
    const { schema, model } = await getModel(modelName);
    checkPublicApisPermissions(
      schema,
      model?.rest_permissions?.delete,
      modelName,
    );
    return await deleteFromPublicApis({ schema, model, id });
  }

  async authenticateService(
    modelName: string,
    credentials: { username: string; password: string },
  ) {
    const { schema, model } = await getModel(modelName);
    checkPublicApisPermissions(schema, 'YES', modelName);
    return await authenticateUser({
      credentials,
      jwtService: this.jwtService,
      model,
      modelName,
      schema,
    });
  }

  async findSelfSchema(
    modelName: string,
    user: any,
    id: any = null,
    page = 1,
    limit = 20,
  ) {
    const { schema, model } = await getModel(modelName);

    return selfFind({
      id,
      limit,
      model,
      modelName,
      page,
      schema,
      user,
    });
  }

  async updateSelf(modelName: string, id: string, data: any, user: any) {
    const { schema, model } = await getModel(modelName);

    checkSelfApisPermissions(schema, model?.rest_permissions?.edit, modelName);

    return updateSelf({
      data,
      id,
      model,
      modelName,
      schema,
      user,
    });
  }

  async createSelf(modelName: string, data: any, user: any) {
    const { schema, model } = await getModel(modelName);

    checkSelfApisPermissions(schema, model?.rest_permissions?.new, modelName);
    return createSelfRec({
      data,
      model,
      modelName,
      schema,
      user,
    });
  }

  async deleteSelf(modelName: string, id: string, user: any) {
    const { schema, model } = await getModel(modelName);

    checkSelfApisPermissions(
      schema,
      model?.rest_permissions?.delete,
      modelName,
    );
    return deleteSelf({
      id,
      model,
      modelName,
      schema,
      user,
    });
  }

  async customQuery(
    modelName,
    request,
    data: { query: any; orderBy: any; populate: any; page: any; limit: any },
  ) {
    return customQueryCURD({ request, data, modelName });
  }
}
