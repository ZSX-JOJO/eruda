<a href="https://eruda.liriliri.io/" target="_blank">
  <img src="https://eruda.liriliri.io/img/banner.jpg">
</a>

<h1 align="center">Eruda</h1>

<div align="center">

Console for Mobile Browsers.

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![Downloads][jsdelivr-image]][jsdelivr-url]
[![License][license-image]][npm-url]
[![Donate][donate-image]][paypal-url]

</div>

[npm-image]: https://img.shields.io/npm/v/eruda?style=flat-square
[npm-url]: https://npmjs.org/package/eruda
[jsdelivr-image]: https://img.shields.io/jsdelivr/npm/hm/eruda?style=flat-square
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/eruda
[travis-image]: https://img.shields.io/travis/com/liriliri/eruda?style=flat-square 
[travis-url]: https://app.travis-ci.com/liriliri/eruda
[codecov-image]: https://img.shields.io/codecov/c/github/liriliri/eruda?style=flat-square
[codecov-url]: https://codecov.io/github/liriliri/eruda?branch=master
[license-image]: https://img.shields.io/npm/l/eruda?style=flat-square
[donate-image]: https://img.shields.io/badge/$-donate-0070ba.svg?style=flat-square
[paypal-url]: https://www.paypal.com/paypalme/surunzi

![Eruda](https://eruda.liriliri.io/img/screenshot.jpg)

[中文](doc/README_CN.md)

## Demo

![Demo](https://eruda.liriliri.io/img/qrcode.png)

Browse it on your phone: [https://eruda.liriliri.io/](https://eruda.liriliri.io/)

In order to try it for different sites, execute the script below on browser address bar.

```javascript
javascript:(function () { var script = document.createElement('script'); script.src="//cdn.jsdelivr.net/npm/eruda"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();
```

## Features

* [Console](doc/TOOL_API.md#console): Display JavaScript logs.
* [Elements](doc/TOOL_API.md#elements): Check dom state.
* [Network](doc/TOOL_API.md#network): Show requests status.
* [Resource](/doc/TOOL_API.md#resources): Show localStorage, cookie information.
* [Info](doc/TOOL_API.md#info): Show url, user agent info.
* [Snippets](doc/TOOL_API.md#snippets): Include snippets used most often.
* [Sources](doc/TOOL_API.md#sources): Html, js, css source viewer.

## Install

You can get it on npm.

```bash
npm install eruda --save
```

Add this script to your page.

```html
<script src="node_modules/eruda/eruda.js"></script>
<script>eruda.init();</script>
```

It's also available on [jsDelivr](http://www.jsdelivr.com/projects/eruda) and [cdnjs](https://cdnjs.com/libraries/eruda).

```html
<script src="//cdn.jsdelivr.net/npm/eruda"></script>
<script>eruda.init();</script>
```

The JavaScript file size is quite huge(about 100kb gzipped) and therefore not suitable to include in mobile pages. It's recommended to make sure eruda is loaded only when eruda is set to true on url(http://example.com/?eruda=true), for example:

```javascript
;(function () {
    var src = '//cdn.jsdelivr.net/npm/eruda';
    if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
```

## Configuration

When initialization, a configuration object can be passed in.

* container: Container element. If not set, it will append an element directly
under html root element.
* tool: Choose which default tools you want, by default all will be added.

For more information, please check the [documentation](doc/API.md).

```javascript
let el = document.createElement('div');
document.body.appendChild(el);

eruda.init({
    container: el,
    tool: ['console', 'elements']
});
```

## Plugins

* [eruda-fps](https://github.com/liriliri/eruda-fps): Display page fps info.
* [eruda-features](https://github.com/liriliri/eruda-features): Browser feature detections.
* [eruda-timing](https://github.com/liriliri/eruda-timing): Show performance and resource timing.
* [eruda-memory](https://github.com/liriliri/eruda-memory): Display page memory info.
* [eruda-code](https://github.com/liriliri/eruda-code): Run JavaScript code.
* [eruda-benchmark](https://github.com/liriliri/eruda-benchmark): Run JavaScript benchmarks.
* [eruda-geolocation](https://github.com/liriliri/eruda-geolocation): Test geolocation.
* [eruda-dom](https://github.com/liriliri/eruda-dom): Navigate dom tree.
* [eruda-orientation](https://github.com/liriliri/eruda-orientation): Test orientation api.
* [eruda-touches](https://github.com/liriliri/eruda-touches): Visualize screen touches.

If you want to create a plugin yourself, follow the guides [here](./doc/PLUGIN.md).

## Related Projects

* [chii](https://github.com/liriliri/chii): Remote debugging tool.
* [chobitsu](https://github.com/liriliri/chobitsu): Chrome devtools protocol JavaScript implementation.
* [licia](https://github.com/liriliri/licia): Utility library used by eruda.
* [eruda-webpack-plugin](https://github.com/huruji/eruda-webpack-plugin): Eruda webpack plugin.

## Contribution

Read [Contributing Guide](.github/CONTRIBUTING.md) for development setup instructions.
