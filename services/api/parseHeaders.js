const { throwAppError } = require('@app-core/errors');

/**
 * Parse the HEADERS part of a reqline statement.
 * Expected form (strict): "HEADERS { ...json... }"
 *
 * Returns parsed object or throws with a helpful message.
 */
module.exports = (headersPart) => {
  if (!headersPart) return;

  const splitHeadersPart = headersPart.split(' ');
  const headersKeyword = splitHeadersPart[0];

  const indexOfHeaders =
    headersPart.indexOf('HEADERS') === -1
      ? headersPart.toLowerCase().indexOf('headers')
      : headersPart.indexOf('HEADERS');
  console.log({ indexOfHeaders });

  const hasSpaceAfterHeader = headersPart[indexOfHeaders + 7] === ' ';
  const headersString = headersPart.slice(indexOfHeaders + 7);

  //    Checking adequate spacing
  if (!hasSpaceAfterHeader) {
    throwAppError('Missing space after keyword', 400);
  }

  //   Cheking capitalization or no url keyword
  if (headersKeyword !== headersKeyword.toUpperCase()) {
    throwAppError('Keywords must be uppercase', 400);
  }

  //    Cheking no url at all
  else if (!headersString) {
    throwAppError('Invalid JSON format in HEADERS section', 400);
  }

  try {
    const parsed = JSON.parse(headersString);
    return parsed;
  } catch (err) {
    throwAppError(`Invalid JSON format in HEADERS section`, 400);
  }
};
