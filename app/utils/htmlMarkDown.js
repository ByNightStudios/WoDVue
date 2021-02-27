const { richTextFromMarkdown } = require('@contentful/rich-text-from-markdown');

async function richTextHtml(data) {
  const parsedData = await richTextFromMarkdown(data);
  const promise = new Promise(function(resolve, reject) {
    resolve(parsedData);
  });

  // reject runs the second function in .then
 promise.then(res, () => {
   return res;
 });
}

export default richTextHtml;
