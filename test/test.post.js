/* global require, describe, it */
'use strict';

var mpath = './../lib/post.js';


// MODULES //

var chai = require( 'chai' ),
	proxyquire = require( 'proxyquire' ),
	post = require( mpath );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'post', function tests() {

	var opts = {
		'key': '1234',
		'widget': '5678'
	};

	it( 'should export a function', function test() {
		expect( post ).to.be.a( 'function' );
	});

	it( 'should return a function', function test() {
		expect( post( opts ) ).to.be.a( 'function' );
	});

	it( 'should post data to a remote endpoint and invoke a provided callback', function test( done ) {
		var post,
			data,
			req;

		post = proxyquire( mpath, {
			'request': request
		});

		data = {
			'beep': 'boop'
		};

		req = post( opts );
		req( data, done );

		function request( options, clbk ) {
			var response = {
				'statusCode': 200
			};
			clbk( null, response, '' );
		}
	});

});
