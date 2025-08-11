const { throwAppError } = require('@app-core/errors');

module.exports = (bodyPart) => {
  if (!bodyPart) return;
  const splitBodyPart = bodyPart.split(' ');
  const bodyKeyword = splitBodyPart[0];

  const indexOfBody = bodyPart.indexOf('BODY');
  const hasSpaceAfterBody = bodyPart[indexOfBody + 4] === ' ';
  const bodyString = bodyPart.slice(indexOfBody + 4);

  //   Cheking capitalization or no url keyword
  if (bodyKeyword !== bodyKeyword.toUpperCase()) {
    throwAppError('Keywords must be uppercase', 400);
  }

  //    Checking adequate spacing
  if (!hasSpaceAfterBody) {
    throwAppError('Missing space after keyword', 400);
  }

  //    Cheking no url at all
  else if (!bodyString) {
    throwAppError('Invalid JSON format in BODY section', 400);
  }

  try {
    const parsed = JSON.parse(bodyString);
    return parsed;
  } catch (err) {
    throwAppError(`Invalid JSON format in BODY section`, 400);
  }
};
