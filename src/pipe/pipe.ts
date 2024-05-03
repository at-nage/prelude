import { Lambda } from '../lambda';

import { Pipe } from './types';

export const pipe: Pipe = <T>(initial: T, ...functions: Lambda<T, T>[]): T => {
  return functions.reduce((value, action) => action(value), initial);
};
