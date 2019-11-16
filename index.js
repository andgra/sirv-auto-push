const sirv = require('sirv');
const cookie = require('cookie');
const autoPush = require('h2-auto-push');

const CACHE_COOKIE_KEY = '__sirv_ap_cache__';

const noop = () => {};

const sirvAp = (dir, opts = {}) => {
  const { cacheConfig, prefix = '/', ...sirvOpts } = opts;
  const ap = new autoPush.AutoPush(dir, cacheConfig);

  const sirvFound = (res, url) => {
    if (
      url &&
      // Record as a static file only when the path starts with `prefix`.
      url.startsWith(prefix)
    ) {
      ap.recordRequestPath(res.stream.session, url, true);
    }
  };
  const sirvApMiddleware = sirv(dir, { setHeaders: sirvFound, ...sirvOpts });
  const sirvMiddleware = sirv(dir, sirvOpts);

  return async (req, res, next) => {
    const stream = req.stream;
    const url = req.url;

    // In case it is http1 request
    if (!stream) {
      return sirvMiddleware(req, res, next);
    }

    const cookies = cookie.parse(req.headers['cookie'] || '');
    const cacheKey = cookies[CACHE_COOKIE_KEY];
    const { newCacheCookie, pushFn } = await ap.preprocessRequest(
      url,
      stream,
      cacheKey
    );

    res.setHeader(
      'set-cookie',
      cookie.serialize(CACHE_COOKIE_KEY, newCacheCookie, {
        path: '/'
      })
    );

    stream.on('pushError', err => {
      req.log.error('Error while pushing', err);
    });

    const sirvNotFoundNext = () => {
      if (url) {
        ap.recordRequestPath(stream.session, url, false);
      }
      next();
    };

    pushFn()
      .then(noop)
      .catch(noop);

    sirvApMiddleware(req, res, sirvNotFoundNext);
  };
};

module.exports = sirvAp;
