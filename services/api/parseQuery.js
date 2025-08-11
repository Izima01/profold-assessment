const { throwAppError } = require('@app-core/errors');

module.exports = (queryPart) => {
  if (!queryPart) return;
  const splitQueryPart = queryPart.split(' ');
  const queryKeyword = splitQueryPart[0];

  const indexOfQuery = queryPart.indexOf('QUERY');
  const hasSpaceAfterQuery = queryPart[indexOfQuery + 5] === ' ';
  const queryString = queryPart.slice(indexOfQuery + 5);

  // Checking capitalization or no keyword
  if (queryKeyword !== queryKeyword.toUpperCase()) {
    throwAppError('Keywords must be uppercase', 400);
  }

  //    Checking adequate spacing
  else if (!hasSpaceAfterQuery) {
    throwAppError('Missing space after keyword', 400);
  }

  //    Cheking no url at all
  else if (!queryString) {
    throwAppError('Invalid JSON format in QUERY section', 400);
  }

  try {
    const parsed = JSON.parse(queryString);
    const queryStringParsed = Object.keys(parsed)
      // eslint-disable-next-line prefer-template
      .map((key) => '?' + encodeURIComponent(key) + '=' + encodeURIComponent(parsed[key]))
      .join('&');
    return { query: parsed, queryStr: queryStringParsed };
  } catch (err) {
    throwAppError(`Invalid JSON format in QUERY section`, 400);
  }
};
