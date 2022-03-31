import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/user/entities/user.role';

export const hasRoles = (hasRoles: ROLE[]) => SetMetadata('role', hasRoles);
