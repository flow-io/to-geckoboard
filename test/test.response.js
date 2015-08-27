/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	onResponse = require( './../lib/response.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'onResponse', function tests() {

	it( 'should export a function', function test() {
		expect( onResponse ).to.be.a( 'function' );
	});

	it( 'should return a function', function test() {
		expect( onResponse( noop ) ).to.be.a( 'function' );
	});

	it( 'should return an error using a provided callback', function test() {
		var res = onResponse( next );

		res( new Error(), {}, {} );

		function next( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
		}
	});

	it( 'should return an error using a provided callback if a response status code is not 200', function test() {
		var res = onResponse( next );

		res( null, {
			'statusCode': 401,
			'message': 'Your API key is invalid'
		}, {} );

		function next( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
		}
	});

	it( 'should return an error using a provided callback if a response status code is not 200 and does not contain body or message', function test() {
		var res = onResponse( next );

		res( null, {'statusCode':404}, {} );

		function next( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
		}
	});

	it( 'should invoke a provided callback without any arguments if a request was successful', function test() {
		var res = onResponse( next );

		res( null, {'statusCode':200}, {} );

		function next( error ) {
			if ( error ) {
				assert.ok( false );
			} else {
				assert.ok( true );
			}
		}
	});

});
