/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	nock = require( 'nock' ),
	Stream = require( './../lib/stream.js' ),
	objectMode = require( './../lib/objectMode.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'object mode', function tests() {

	var opts = {
		'key': '1234',
		'widget': '5678'
	};

	it( 'should export a function', function test() {
		expect( objectMode ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided any options', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			objectMode();
		}
	});

	it( 'should return a stream', function test() {
		var oStream = objectMode( opts );
		assert.isTrue( oStream instanceof Stream );
	});

	it( 'should return a stream which allows writing objects', function test( done ) {
		var data,
			s;

		data = {'beep':'boop'};

		nock( 'https://push.geckoboard.com' )
			.post( '/v1/send/'+opts.widget, {
				'api_key': opts.key,
				'data': data
			})
			.reply( 200 );

		s = objectMode( opts );
		s.write( data, done );
		s.end();
	});

});
