import { helper } from '@ember/component/helper';

export function arrayIncludes([array, value]/*, hash*/) {
  return Array.from(array).includes(value);
}

export default helper(arrayIncludes);
