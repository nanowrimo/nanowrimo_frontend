import { helper } from '@ember/component/helper';

export function newlineToBr([text]) {
  //strip html from the text
  let processedText = text.replace(/\r\n/g, "\n");
  processedText = text.replace(/\r/g, "\n");
  processedText = text.replace(/<\/?[^>]+(>|$)/g, "");
  processedText = processedText.replace(/\n/g, "<br/>");
  return processedText;
}

export default helper(newlineToBr);
