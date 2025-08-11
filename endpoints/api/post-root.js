const { throwAppError } = require('@app-core/errors');
const { TimeLogger } = require('@app-core/logger');
const { createHandler } = require('@app-core/server');
const HttpRequest = require('@app-core/http-request');

const parseMethod = require('../../services/api/parseMethod');
const parseUrlPart = require('../../services/api/parseUrlPart');
const parseObjectParts = require('../../services/api/parseObjectParts');

function findPart(array, key) {
  return array.find((part) => part.toLowerCase().includes(key));
}

module.exports = createHandler({
  path: '/',
  method: 'post',
  async handler(rc, helpers) {
    const { start, end, getLogData } = TimeLogger('reqline');
    start('reqline');
    const payload = rc.body.reqline;

    if (!payload) {
      throwAppError('No REQLINE statement', 400);
    }

    const [methodPart, urlPart, ...rest] = payload.split(' | ');

    // Making sure only one space around each delimiter
    const isExtraSpaceAroundAnyDelimiter = [methodPart, urlPart, ...rest].some(
      (part) => part.trim() !== part
    );
    const isNoSpaceAroundAnyDelimiter = [methodPart, urlPart, ...rest].some((part) =>
      part.includes('|')
    );
    if (isExtraSpaceAroundAnyDelimiter || isNoSpaceAroundAnyDelimiter) {
      throwAppError('Invalid spacing around pipe delimiter', 400);
    }

    // Parsing the method part
    const { httpMethod } = parseMethod(methodPart);
    const url = parseUrlPart(urlPart);

    const { query, queryStr } = parseObjectParts(findPart(rest, 'query'), 'QUERY');
    const headers = parseObjectParts(findPart(rest, 'headers'), 'HEADERS');
    const body = parseObjectParts(findPart(rest, 'body'), 'BODY');
    console.log({ headers, query, body });

    const fullUrl = queryStr ? `${url}${queryStr}` : url;

    const request = {
      query: query ?? {},
      body: body ?? {},
      headers: headers ?? {},
      full_url: fullUrl,
    };

    let res;

    try {
      res = await HttpRequest({
        method: httpMethod,
        url: fullUrl,
        headers: headers ?? {},
        data: body ?? {},
      });
    } catch (err) {
      throwAppError(`HTTP request failed: ${err.message}`, 502);
    }

    end('reqline');
    const logData = getLogData();
    return {
      status: helpers.http_statuses.HTTP_201_CREATED,
      data: {
        request,
        response: {
          http_status: res.statusCode,
          duration: logData.reqline.endTime - logData.reqline.startTime,
          request_start_timestamp: logData.reqline.startTime,
          request_stop_timestamp: logData.reqline.endTime,
          response_data: res.data,
        },
      },
    };
  },
});
