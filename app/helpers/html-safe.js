import { helper } from '@ember/component/helper';
import { htmlSafe as EmberHtmlSafe }  from '@ember/string';

export function htmlSafe([param]/*, hash*/) {
  return EmberHtmlSafe(param);
}

export default helper(htmlSafe);
