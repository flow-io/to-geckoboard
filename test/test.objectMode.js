/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	Stream = require( './../lib/stream.js' ),
	objectMode = require( './../lib/objectMode.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'object mode', function tests() {

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
		var oStream = objectMode({
			'key': '1234',
			'widget': '5678'
		});
		assert.isTrue( oStream instanceof Stream );
	});

});
