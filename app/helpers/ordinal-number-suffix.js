import { helper } from '@ember/component/helper';

export function ordinalNumberSuffix([num]/*, hash*/) {
  let i = num % 10;
  let j = num % 100;
  if (i == 1 && j != 11) {
      return num + "st";
  }
  if (i == 2 && j != 12) {
      return num + "nd";
  }
  if (i == 3 && j != 13) {
      return num + "rd";
  }
  return num + "th";
}

export default helper(ordinalNumberSuffix);
