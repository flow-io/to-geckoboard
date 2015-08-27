/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	Transform = require( 'readable-stream' ).Transform,
	nock = require( 'nock' ),
	through2 = require( 'through2' ),
	Stream = require( './../lib/stream.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'Stream', function tests() {

	var opts = {
		'key': '1234',
		'widget': '1234'
	};

	it( 'should export a function', function test() {
		expect( Stream ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided stream options', function test() {
		expect( Stream ).to.throw( Error );
	});

	it( 'should throw an error if not provided a key and widget id', function test() {
		var stream = Stream;
		expect( foo ).to.throw( Error );
		expect( bar ).to.throw( Error );
		expect( beep ).to.throw( Error );
		function foo() {
			stream( {} );
		}
		function bar() {
			stream({
				'key': '123'
			});
		}
		function beep() {
			stream({
				'widget': '123'
			});
		}
	});

	it( 'should return a transform stream', function test() {
		var s = new Stream( opts );
		assert.instanceOf( s, Transform );
	});

	it( 'should not require the `new` operator', function test() {
		var stream = Stream,
			s;

		s = stream( opts );
		assert.instanceOf( s, Transform );
	});

	it( 'should post data to a remote endpoint', function test( done ) {
		var total = 10,
			cnt = 0,
			data,
			s, t,
			i;

		data = {
			'beep':'boop',
			'bop': [ 'woot', 'wut', 'wopper' ],
			'bap': 5,
			'bip': null,
			'bup': {
				'a': [1,2,3,4],
				'b': [1,2,3,4],
				'c': [1,2,3,4],
				'd': [1,2,3,4]
			}
		};

		nock( 'https://push.geckoboard.com' )
			.post( '/v1/send/'+opts.widget, {
				'api_key': opts.key,
				'data': data
			})
			.times( total )
			.reply( 200 );

		s = new Stream( opts );
		t = through2( onData );
		s.pipe( t );

		for ( i = 0; i < total; i++ ) {
			s.write( JSON.stringify( data ) );
		}
		s.end();

		function onData( chunk, enc, clbk ) {
			clbk();
			if ( ++cnt === total ) {
				done();
			}
		}
	});

	it( 'should support Buffer objects', function test( done ) {
		var total = 10,
			cnt = 0,
			data,
			s, t,
			i;

		data = {
			'beep':'boop'
		};

		nock( 'https://push.geckoboard.com' )
			.post( '/v1/send/'+opts.widget, {
				'api_key': opts.key,
				'data': data
			})
			.times( total )
			.reply( 200 );

		s = new Stream( opts );
		t = through2( onData );
		s.pipe( t );

		for ( i = 0; i < total; i++ ) {
			s.write( new Buffer( JSON.stringify( data ) ) );
		}
		s.end();

		function onData( chunk, enc, clbk ) {
			clbk();
			if ( ++cnt === total ) {
				done();
			}
		}
	});

	it( 'should handle endpoint failure; e.g., failed requests', function test( done ) {
		var total = 10,
			cnt = 0,
			data,
			s, t,
			i;

		data = {
			'beep':'boop'
		};

		nock( 'https://push.geckoboard.com' )
			.post( '/v1/send/'+opts.widget, {
				'api_key': opts.key,
				'data': data
			})
			.times( total )
			.reply( 404, {
				'message': 'Resource unavailable.'
			});

		s = new Stream( opts );
		t = through2( onData );
		s.pipe( t );

		for ( i = 0; i < total; i++ ) {
			s.write( JSON.stringify( data ) );
		}
		s.end();

		function onData( chunk, enc, clbk ) {
			chunk = JSON.parse( chunk.toString() );
			assert.strictEqual( chunk.status, 404 );
			clbk();
			if ( ++cnt === total ) {
				done();
			}
		}
	});

	it( 'should emit an error if unable to parse a buffer chunk as JSON', function test( done ) {
		var data,
			s;

		data = '{"beep:"boop"}';

		s = new Stream( opts );
		s.on( 'error', onError );

		s.write( data );
		s.end();

		function onError( err ) {
			if ( err ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should emit an error if unable to parse a string chunk as JSON', function test( done ) {
		var data,
			s;

		data = '{"beep:"boop"}';

		s = new Stream({
			'key': opts.key,
			'widget': opts.widget
		});
		s.on( 'error', onError );

		s.write( data, 'utf8' );
		s.end();

		function onError( err ) {
			if ( err ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should provide a method to destroy a stream', function test( done ) {
		var count = 0,
			s;

		s = new Stream( opts );

		expect( s.destroy ).to.be.a( 'function' );

		s.on( 'error', onError );
		s.on( 'close', onClose );

		s.destroy( new Error() );

		function onError( err ) {
			count += 1;
			if ( err ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			if ( count === 2 ) {
				done();
			}
		}
		function onClose() {
			count += 1;
			assert.ok( true );
			if ( count === 2 ) {
				done();
			}
		}
	});

	it( 'should not allow a stream to be destroyed more than once', function test( done ) {
		var s;

		s = new Stream( opts );

		s.on( 'error', onError );
		s.on( 'close', onClose );

		// If the stream is closed twice, the test will error...
		s.destroy();
		s.destroy();

		function onClose() {
			assert.ok( true );
			done();
		}
		function onError( err ) {
			assert.ok( false );
		}
	});

});
