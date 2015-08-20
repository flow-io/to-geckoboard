/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	stream = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'flow-to-geckoboard', function tests() {

	it( 'should export a function', function test() {
		expect( stream ).to.be.a( 'function' );
	});

	it( 'should export a function to create a stream in object mode', function test() {
		expect( stream.objectMode ).to.be.a( 'function' );
	});

	it( 'should export a stream factory', function test() {
		expect( stream.factory ).to.be.a( 'function' );
	});

});
