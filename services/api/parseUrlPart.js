const { throwAppError } = require('@app-core/errors');

module.exports = (urlPart) => {
  const splitUrlPart = urlPart.split(' ');
  const urlKeyword = splitUrlPart[0];
  const url = splitUrlPart[1];

  const indexOfURL = urlPart.indexOf('URL');
  const hasSpaceAfterURL = urlPart[indexOfURL + 3] === ' ';

  //   Cheking capitalization or no url keyword
  if (urlKeyword.toUpperCase() !== 'URL') {
    throwAppError('Missing required URL keyword', 400);
  } else if (urlKeyword !== urlKeyword.toUpperCase()) {
    throwAppError('Keywords must be uppercase', 400);
  }

  //    Checking adequate spacing
  if (splitUrlPart.length > 2) {
    throwAppError('Multiple spaces found where single space expected', 400);
  } else if (!hasSpaceAfterURL) {
    throwAppError('Missing space after keyword', 400);
  }

  //    Cheking no url at all
  else if (!url) {
    throwAppError('No URL given', 400);
  }

  return url;
};
