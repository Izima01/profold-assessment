const { throwAppError } = require('@app-core/errors');

/**
 * Parse the HEADERS part of a reqline statement.
 * Expected form (strict): "HEADERS { ...json... }"
 *
 * Returns parsed object or throws with a helpful message.
 */
const parseObjectParts = (selectPart, partName) => {
  if (!selectPart) return;

  if (!selectPart.includes(partName) || !selectPart.toLowerCase().includes(partName.toLowerCase()))
    return;

  const splitSelectPart = selectPart.split(' ');
  const partKeyword = splitSelectPart[0];

  const indexOfPartKeyword =
    selectPart.indexOf(partName) === -1
      ? selectPart.toLowerCase().indexOf(partName.toLowerCase())
      : selectPart.indexOf(partName);

  const hasSpaceAfterKeyword = selectPart[indexOfPartKeyword + partName.length] === ' ';
  const partString = selectPart.slice(indexOfPartKeyword + partName.length + 1);

  //    Checking adequate spacing
  if (!hasSpaceAfterKeyword) {
    throwAppError('Missing space after keyword', 400);
  }

  //   Cheking capitalization or no url keyword
  if (partKeyword !== partKeyword.toUpperCase()) {
    throwAppError('Keywords must be uppercase', 400);
  }

  if (partString !== partString.trim()) {
    throwAppError('Multiple spaces found where single space expected', 400);
  }

  //    Cheking no url at all
  else if (!partString) {
    throwAppError(`Invalid JSON format in ${partName} section`, 400);
  }

  try {
    const parsed = JSON.parse(partString);
    if (partName === 'QUERY') {
      const queryStringParsed = Object.keys(parsed)
        // eslint-disable-next-line prefer-template
        .map((key) => '?' + encodeURIComponent(key) + '=' + encodeURIComponent(parsed[key]))
        .join('&');
      return { query: parsed, queryStr: queryStringParsed };
    }
    return parsed;
  } catch (err) {
    throwAppError(`Invalid JSON format in ${partName} section`, 400);
  }
};

module.exports = parseObjectParts;
