Geckoboard
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Creates a [writable stream](https://nodejs.org/api/stream.html) for pushing data to [Geckoboard](https://www.geckoboard.com/).


## Installation

``` bash
$ npm install flow-to-geckoboard
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var stream = require( 'flow-to-geckoboard' );
```

#### stream( options )

Creates a [writable stream](https://nodejs.org/api/stream.html) for pushing data to [Geckoboard](https://www.geckoboard.com/).

``` javascript
var oStream = stream({
	'key': '<your_key_goes_here>',
	'id': '<your_widget_id_goes_here>'
});

// Data for a Geck-o-Meter widget:
var data = {
	'item': Math.random() * 100,
	'min': {
		'value': 0
	},
	'max': {
		'value': 100
	}
};

// Write the data to the stream:
oStream.write( JSON.stringify( data ) );

// End the stream:
oStream.end();
```

The function accepts the following options:

*	__objectMode__: `boolean` which specifies whether a [stream](https://nodejs.org/api/stream.html) should operate in object mode. Default: `false`.
*	__decodeStrings__: `boolean` which specifies whether written `strings` should be decoded into `Buffer` objects. Default: `true`.
*	__highWaterMark__: specifies the `Buffer` level at which `write()` calls start returning `false`. Default: `16` (16KB).

To set [stream](https://nodejs.org/api/stream.html) `options`,

``` javascript
var opts = {
	'key': '<your_key_goes_here>',
	'id': '<your_widget_id_goes_here>',
	'objectMode': true,
	'decodeStrings': false,
	'highWaterMark': 64	
};

var oStream = stream( opts );
```



#### stream.factory( options )

Creates a reusable [stream](https://nodejs.org/api/stream.html) factory. The factory method ensures [streams](https://nodejs.org/api/stream.html) are configured identically by using the same set of provided `options`.

``` javascript
var opts = {
	'key': '<your_key_goes_here>',
	'id': '<your_widget_id_goes_here>'
};

var factory = stream.factory( opts );

// Create 10 identically configured streams...
var streams = [];
for ( var i = 0; i < 10; i++ ) {
	streams.push( factory() );
}
```


#### stream.objectMode( options )

This method is a convenience function to create [streams](https://nodejs.org/api/stream.html) which always operate in `objectMode`. The method will __always__ override the `objectMode` option in `options`.

``` javascript
var opts = {
	'key': '<your_key_goes_here>',
	'id': '<your_widget_id_goes_here>'
};

var data = {
	'item': Math.random() * 100,
	'min': {
		'value': 0
	},
	'max': {
		'value': 100
	}
};

var oStream = stream.objectMode( opts );
oStream.write( data );
oStream.end();
```



## Examples

``` javascript
var Stream = require( 'flow-to-geckoboard' );

var oStream,
	data,
	i;

oStream = new Stream({
	'key': '<your_key_goes_here>', // INSERT KEY HERE //
	'id': '<your_widget_id_goes_here>' // INSERT WIDGET ID HERE //
});

function write( data ) {
	return function() {
		oStream.write( JSON.stringify( data ) );
	};
}

function end() {
	oStream.end();
}

for ( i = 0; i < 100; i++ ) {
	data = {
		'item': Math.random() * 100,
		'min': {
			'value': 0
		},
		'max': {
			'value': 100
		}
	};
	// Stagger posting values to Geckoboard:
	setTimeout( write( data ), i*1000 );
}

// Close the stream:
setTimeout( end, i*1000 );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## CLI


### Installation

To use the module as a general utility, install the module globally

``` bash
$ npm install -g flow-to-geckoboard
```


### Usage

``` bash
Usage: flow-to-geckoboard --key <key> --widget <widget_id> [options]

Options:

  -h,   --help                 Print this message.
  -V,   --version              Print the package version.
        --key [key]            Geckoboard API key.
        --widget [widget]      Geckoboard widget id.
  -hwm, --highwatermark [hwm]  Specify how much data can be buffered into memory
                               before applying back pressure. Default: 16KB.
  -nds, --no-decodestrings     Prevent strings from being converted into buffers
                               before streaming to destination. Default: false.
  -om,  --objectmode           Write any value rather than only buffers and strings.
                               Default: false.
```

The `flow-to-geckoboard` command is available as a [standard stream](http://en.wikipedia.org/wiki/Pipeline_%28Unix%29).

``` bash
$ <stdout> | flow-to-geckoboard --key <key> --widget <widget_id>
``` 

### Notes

*	In addition to the command-line `key` and `widget` options, the `key` and `widget` options may be specified via environment variables: `GECKOBOARD_API_KEY` and `GECKOBOARD_WIDGET_ID`. The command-line options __always__ take precedence.



### Examples

``` bash
$ echo '{"item":50,"min":{"value":0},"max":{"value":100}}' | flow-to-geckboard --key <key> --widget <widget_id>
```

Setting credentials using environment variables:

``` bash
$ GECKOBOARD_API_KEY=<key> GECKOBOARD_WIDGET_ID=<widget_id> echo '{"item":67,"min":{"value":0},"max":{"value":100}}' | flow-to-geckboard
```

For local installations, modify the above command to point to the local installation directory; e.g., 

``` bash
$ echo '{"item":32,"min":{"value":0},"max":{"value":100}}' | ./node_modules/.bin/flow-to-geckoboard --key <key> --widget <widget_id>
```

Or, if you have cloned this repository and run `npm install`, modify the command to point to the executable; e.g., 

``` bash
$ echo '{"item":49,"min":{"value":0},"max":{"value":100}}' | node ./bin/cli --key <key> --widget <widget_id>
```


---
## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


## Copyright

Copyright &copy; 2015. The [Flow.io](https://github.com/flow-io) Authors.


[npm-image]: http://img.shields.io/npm/v/flow-to-geckoboard.svg
[npm-url]: https://npmjs.org/package/flow-to-geckoboard

[travis-image]: http://img.shields.io/travis/flow-io/to-geckoboard/master.svg
[travis-url]: https://travis-ci.org/flow-io/to-geckoboard

[codecov-image]: https://img.shields.io/codecov/c/github/flow-io/to-geckoboard/master.svg
[codecov-url]: https://codecov.io/github/flow-io/to-geckoboard?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/to-geckoboard.svg
[dependencies-url]: https://david-dm.org/flow-io/to-geckoboard

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/to-geckoboard.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/to-geckoboard

[github-issues-image]: http://img.shields.io/github/issues/flow-io/to-geckoboard.svg
[github-issues-url]: https://github.com/flow-io/to-geckoboard/issues
