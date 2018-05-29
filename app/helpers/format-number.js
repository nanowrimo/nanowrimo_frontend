import { helper } from '@ember/component/helper';

export function formatNumber([number]/*, hash*/) {
  return Number(number).toLocaleString('en-US');
}

export default helper(formatNumber);
