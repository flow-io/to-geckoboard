/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	Writable = require( 'readable-stream' ).Writable,
	nock = require( 'nock' ),
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

	it( 'should return a writable stream', function test() {
		var s = new Stream( opts );
		assert.instanceOf( s, Writable );
	});

	it( 'should not require the `new` operator', function test() {
		var stream = Stream,
			s;

		s = stream( opts );
		assert.instanceOf( s, Writable );
	});

	it( 'should post data to a remote endpoint', function test( done ) {
		var data,
			s;

		data = {'beep':'boop'};

		nock( 'https://push.geckoboard.com' )
			.post( '/v1/send/'+opts.widget, {
				'api_key': opts.key,
				'data': data
			})
			.reply( 200 );

		s = new Stream( opts );
		s.write( JSON.stringify( data ), done );
		s.end();
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
			'widget': opts.widget,
			'decodeStrings': false
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
