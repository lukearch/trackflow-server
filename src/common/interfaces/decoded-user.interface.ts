import { Role } from '@prisma/client';

export interface DecodedUserToken {
  sub: string;
  email: string;
  role: Role;
}
