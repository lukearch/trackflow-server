import { SetMetadata } from '@nestjs/common';

export const JSON_IGNORED_PROPS = 'json_ignored_props';
export const Ignore = (...props: string[]) =>
  SetMetadata(JSON_IGNORED_PROPS, props);
