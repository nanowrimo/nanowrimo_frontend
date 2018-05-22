import { helper } from '@ember/component/helper';

export function shortYear([year]/*, hash*/) {
  return String(year).slice(-2);
}

export default helper(shortYear);
