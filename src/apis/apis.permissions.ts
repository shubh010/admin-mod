import { ForbiddenException, NotFoundException } from '@nestjs/common';

export const checkPublicApisPermissions = (schema, permission, modelName) => {
  if (!schema) {
    throw new NotFoundException(`Schema for model "${modelName}" not found`);
  }
  if (permission !== 'YES') {
    throw new ForbiddenException(
      `Schema for model "${modelName}" does not have required permissions: (${permission})`,
    );
  }
};

export const checkSelfApisPermissions = (schema, permission, modelName) => {
  if (!schema) {
    throw new NotFoundException(`Schema for model "${modelName}" not found`);
  }
  if (permission === 'AUTHENTICATE_USER' || permission === 'YES') {
    return true;
  } else {
    throw new ForbiddenException(
      `Schema for model "${modelName}" does not have required permissions: (${permission})`,
    );
  }
};
