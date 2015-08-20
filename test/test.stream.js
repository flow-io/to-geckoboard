/* global require, describe, it */
'use strict';

var mpath = './../lib/stream.js';


// MODULES //

var chai = require( 'chai' ),
	Writable = require( 'readable-stream' ).Writable,
	proxyquire = require( 'proxyquire' ),
	Stream = require( mpath );


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

	it( 'should post data to a remote endpoint', function test( done ) {
		var stream,
			data,
			s;

		stream = proxyquire( mpath, {
			'./post.js': post
		});

		data = {'beep':'boop'};

		s = stream( opts );
		s.write( JSON.stringify( data ), done );

		function post() {
			return function post( d, clbk ) {
				assert.deepEqual( d, data );
				clbk();
			};
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
