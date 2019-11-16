# sirv-auto-push

Middleware for express based apps which serves static files via [sirv](https://github.com/lukeed/sirv) using [h2-auto-push](https://github.com/google/node-h2-auto-push).

## Getting started

### Using npm

```bash
npm i -S sirv-auto-push
```

### Using yarn

```bash
yarn add sirv-auto-push
```


## Usage

```js
const express = require('express');
const sirvAp = require('sirv-auto-push');

const app = express();

app.use(sirvAp("static", { dev: IS_DEV }));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Server listening on port 3000');
});
```



## API

### sirvAp(dir, opts={})

Returns: `Function`

The returned function is a middleware in the standard Express-like signature: `(req, res, next)`, where `req` is the [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage), `res` is the [`http.ServerResponse`](https://nodejs.org/dist/latest-v9.x/docs/api/http.html#http_class_http_serverresponse), and `next` (in this case) is the function to call if no file was found for the given path.

#### dir
Type: `String`<br>
Default: `.`

The directory from which to read and serve assets. It is resolved to an absolute path &mdash; you must provide an absolute path yourself if `process.cwd()` is not the correct assumption.

#### opts.prefix
Type: `String`<br>
Default: `/`

Record file for auto pushing only when the path starts with `prefix`.

#### opts.cacheConfig

See [h2-auto-push](https://github.com/google/node-h2-auto-push#assetcacheconfig) api for cache config

#### ...opts

See [sirv](https://github.com/lukeed/sirv/tree/master/packages/sirv#optsdev) api for rest options


## License

MIT © Andrey Grandilevskiy
