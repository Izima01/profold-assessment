const { throwAppError } = require('@app-core/errors');

module.exports = (methodPart) => {
  const splitMethodPart = methodPart.split(' ');
  const httpKeyword = splitMethodPart[0];
  const httpMethod = splitMethodPart[1];

  const indexOfURL = methodPart.indexOf('HTTP');
  const hasSpaceAfterHTTP = methodPart[indexOfURL + 4] === ' ';

  // Checking adequate spacing
  if (splitMethodPart.length > 2) {
    throwAppError('Multiple spaces found where single space expected', 400);
  } else if (!hasSpaceAfterHTTP) {
    throwAppError(`Missing space after keyword: ${httpKeyword}`, 400);
  }

  // Checking capitalization or no httpword
  else if (httpKeyword.toUpperCase() !== 'HTTP') {
    throwAppError('Missing required HTTP keyword', 400);
  } else if (httpKeyword !== httpKeyword.toUpperCase()) {
    throwAppError('Keywords must be uppercase', 400);
  }

  // Checking the method
  else if (!httpMethod) {
    throwAppError('No HTTP method', 400);
  } else if (httpMethod !== httpMethod.toUpperCase()) {
    throwAppError('HTTP method must be uppercase', 400);
  } else if (!['GET', 'POST'].includes(httpMethod)) {
    throwAppError('Invalid HTTP method. Only GET and POST are supported', 400);
  }

  return { httpKeyword, httpMethod };
};
