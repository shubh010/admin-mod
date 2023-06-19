import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { checkSelfApisPermissions } from './apis.permissions.js';
import { constants } from '../const.js';
import slugify from 'slugify';

import { getModel } from './apis.service.js';

export const paginatedFind = async (
  schema: any,
  modelName,
  model,
  page,
  limit,
) => {
  const refs = model.fields
    .filter((item) => item.ref !== undefined)
    .map((item) => item.field_name);

  const total = await schema.countDocuments({});
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const nextUrl = hasNextPage
    ? `/models/${modelName}?page=${page + 1}&limit=${limit}`
    : null;
  const prevUrl = hasPreviousPage
    ? `/models/${modelName}?page=${page - 1}&limit=${limit}`
    : null;

  const result = await schema
    .find({})
    .populate(refs)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  return { total, totalPages, page, limit, nextUrl, prevUrl, result };
};

export const findOneFromPublicApis = async ({
  schema,
  model,
  id,
}: {
  schema: any;
  model: any;
  id: string;
}) => {
  const refs = model.fields
    .filter((item) => item.ref !== undefined)
    .map((item) => item.field_name);
  const result = await schema.findById(id).populate(refs);
  if (!result) {
    throw new NotFoundException(`Record with id "${id}" not found`);
  }
  return result;
};

export const createOneFromPublicApis = async ({
  schema,
  model,
  data,
}: {
  schema: any;
  model: any;
  data: any;
}) => {
  const encField = model.fields.filter((item) => item.is_hashed === true);

  encField.map((item) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data[item.field_name], salt);
    data[item.field_name] = hash;
  });

  const slug_field = model.fields.filter((item) => item?.is_slug == true)[0]
    .field_name;

  if (slug_field) {
    try {
      // @ts-ignore
      const slug = slugify(data[slug_field]);
      data[slug_field] = slug;
    } catch (err) {
      throw new BadRequestException({ message: 'cannot generate slug', err });
    }
  }

  try {
    const result = await schema.create(data);

    return result;
  } catch (err) {
    throw new BadRequestException({ message: 'Something went wrong', err });
  }
};

export const updateOneFromPublicApis = async ({
  schema,
  model,
  data,
  id,
}: {
  schema: any;
  model: any;
  data: any;
  id: string;
}) => {
  try {
    const result = await schema.findByIdAndUpdate(id, data, { new: true });
    if (!result) {
      throw new NotFoundException(`Record with id "${id}" not found`);
    }
    return result;
  } catch (err) {
    throw new BadRequestException({ message: 'Something went wrong', err });
  }
};

export const deleteFromPublicApis = async ({
  schema,
  model,
  id,
}: {
  schema: any;
  model: any;
  id: string;
}) => {
  try {
    const result = await schema.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Record with id "${id}" not found`);
    }
    return result;
  } catch (err) {
    throw new BadRequestException({ message: 'Something went wrong', err });
  }
};

export const authenticateUser = async ({
  schema,
  model,
  modelName,
  credentials,
  jwtService,
}: {
  schema: any;
  model: any;
  credentials: any;
  jwtService: any;
  modelName: string;
}) => {
  const user = model.fields.filter(
    (item) => item.use_for_authentication === true && item.unique === true,
  )[0];
  const password = model.fields.filter(
    (item) => item.use_for_authentication === true && item.is_hashed === true,
  )[0];
  console.log(credentials);

  const query = {};
  query[user.field_name] = credentials.username;
  const record = await schema.findOne(query);

  if (!record) {
    throw new NotFoundException(
      `Record with id "${credentials.username}" not found`,
    );
  }
  const passwordMatches = await bcrypt.compare(
    credentials.password,
    record[password.field_name],
  );
  if (!passwordMatches)
    throw new ForbiddenException(`Invalid credentials for "${modelName}".`);

  const payload = {
    username: record[user.field_name],
    sub: record._id,
    model: modelName,
  };

  const accessToken = await jwtService.signAsync(payload);
  return { access: accessToken };
};

export const selfFind = async ({
  schema,
  model,
  id,
  modelName,
  user,
  page,
  limit,
}: {
  schema: any;
  model: any;
  id: string | null;
  modelName: string;
  user: any;
  page: any;
  limit: any;
}) => {
  const primary_ref = model.fields.filter(
    (item) => item.primary_ref === true,
  )[0]!.field_name;

  const refs = model.fields
    .filter((item) => item.ref !== undefined)
    .map((item) => item.field_name);

  const query = {};
  if (id) {
    checkSelfApisPermissions(schema, model.rest_permissions.show, modelName);
    query[primary_ref] = user['sub'];
    query['_id'] = id;

    const result = await schema.findOne(query).populate(refs);
    if (!result) {
      throw new NotFoundException(`Record with id "${id}" not found`);
    }
    return result;
  }

  checkSelfApisPermissions(schema, model?.rest_permissions?.list, modelName);
  query[primary_ref] = user['sub'];
  const total = await schema.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;

  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const nextUrl = hasNextPage
    ? `/models/${modelName}?page=${page + 1}&limit=${limit}`
    : null;
  const prevUrl = hasPreviousPage
    ? `/models/${modelName}?page=${page - 1}&limit=${limit}`
    : null;

  const result = await schema
    .find(query)
    .populate(refs)
    .skip(skip)
    .limit(limit)
    .exec();
  return { total, totalPages, page, nextUrl, prevUrl, limit, result };
};

export const createSelfRec = async ({
  schema,
  model,
  modelName,
  user,
  data,
}: {
  schema: any;
  model: any;
  modelName: string;
  user: any;
  data: any;
}) => {
  const primary_ref = model.fields.filter(
    (item) => item.primary_ref === true,
  )[0].field_name;

  const slug_field = model.fields.filter((item) => item?.is_slug == true)[0]
    .field_name;

  if (slug_field) {
    try {
      // @ts-ignore
      const slug = slugify(data[slug_field]);
      data[slug_field] = slug;
    } catch (err) {
      throw new BadRequestException({ message: 'cannot generate slug', err });
    }
  }

  try {
    data[primary_ref] = user['sub'];
    const result = await schema.create(data);
    return result;
  } catch (err) {
    throw new BadRequestException({ message: 'Something went wrong', err });
  }
};

export const updateSelf = async ({
  schema,
  model,
  id,
  modelName,
  user,
  data,
}: {
  schema: any;
  model: any;
  id: string | null;
  modelName: string;
  user: any;
  data: any;
}) => {
  const primary_ref = model.fields.filter(
    (item) => item.primary_ref === true,
  )[0].field_name;
  const query = {};
  try {
    query[primary_ref] = user['sub'];
    query['_id'] = id;
    const result = await schema.findOneAndUpdate(query, data, {
      new: true,
    });
    if (!result) {
      throw new NotFoundException(`Record with id "${id}" not found`);
    }
    return result;
  } catch (err) {
    throw new BadRequestException({ message: 'Something went wrong', err });
  }
};

export const deleteSelf = async ({
  schema,
  model,
  id,
  modelName,
  user,
}: {
  schema: any;
  model: any;
  id: string | null;
  modelName: string;
  user: any;
}) => {
  try {
    const primary_ref = model.fields.filter(
      (item) => item.primary_ref === true,
    )[0].field_name;

    const query = {};

    try {
      query[primary_ref] = user['sub'];
      query['_id'] = id;
      const result = await schema.findOneAndDelete(query);
      if (!result) {
        throw new NotFoundException(`Record with id "${id}" not found`);
      }
      return result;
    } catch (err) {
      throw new BadRequestException({
        message: 'Something went wrong',
        err,
      });
    }
  } catch (err) {
    throw new BadRequestException({ message: 'Something went wrong', err });
  }
};

export const customQueryCURD = async ({
  modelName,
  request,
  data,
}: {
  request: any;
  modelName: string;
  data: { query: any; orderBy: any; populate: any; page: any; limit: any };
}) => {
  if (request['headers'].x_api_key === constants.x_api_key) {
    const { schema, model } = await getModel(modelName);
    if (!schema) {
      throw new NotFoundException(`Schema for model "${modelName}" not found`);
    }

    const total = await schema.countDocuments(data.query);
    const skip = (data.page - 1) * data.limit;
    const totalPages = Math.ceil(total / data.limit);

    try {
      const result = await schema
        .find(data.query)
        .sort(data.orderBy)
        .populate(data.populate)
        .skip(skip)
        .limit(data.limit)
        .exec();
      return {
        total,
        totalPages,
        page: data.page,
        limit: data.limit,
        result,
      };
    } catch (err) {
      throw new BadRequestException({ message: 'Something went wrong', err });
    }
  } else {
    throw new ForbiddenException(
      `You do not have authorizations to perform these actions.`,
    );
  }
};
