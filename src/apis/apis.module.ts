import { Module } from '@nestjs/common';
import { ApisService } from './apis.service.js';
import { ApisController } from './apis.controller.js';

import { JwtModule } from '@nestjs/jwt';
import { constants } from '../const.js';
import { Model } from '../schemas/model-schema.js';
import { generateSchemas } from '../admin-js/auto-generate.config.js';

export const getModels = async () => {
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
      },
    },
  ]);

  const resourcesSchema = generateSchemas(models);
  return { resourcesSchema, models };
};

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: constants.jwtConstants,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [ApisController],
  providers: [ApisService],
})
export class ApisModule {}
