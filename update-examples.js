const fs = require('fs');
const path = require('path');

const fileRegex = /Example ([^\.\n]+.[A-Za-z0-9]+)/;

function updateExamples(filename) {
  let content = fs.readFileSync(filename).toString();

  let hasEnd = false;
  let position = 0;

  do {
    const match = content.substring(position).match(fileRegex);
    if (match) {
      const file = match.slice(1).join('');
      const fullPath = path.join(path.dirname(filename), file);

      let fileContent;
      try {
        fileContent = fs
          .readFileSync(fullPath)
          .toString()
          .replace(/(\s+)$/, '');
      } catch (e) {
        if (e.code === 'ENOENT') {
          position += match.index + match[0].length;
          continue;
        } else {
          throw e;
        }
      }

      const contentStartMatch = content
        .substring(position + match.index)
        .match(/```[A-Za-z]*/);
      const contentEndIdx = content.indexOf(
        '```',
        position +
          match.index +
          contentStartMatch.index +
          contentStartMatch[0].length
      );

      content =
        content.substring(
          0,
          position +
            match.index +
            contentStartMatch.index +
            contentStartMatch[0].length
        ) +
        '\r\n' +
        fileContent +
        '\r\n' +
        content.substring(contentEndIdx);

      position += contentEndIdx;
    } else {
      hasEnd = true;
    }
  } while (!hasEnd);

  fs.writeFileSync(filename, content);
}

module.exports = updateExamples;
