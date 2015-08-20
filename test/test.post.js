/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	nock = require( 'nock' ),
	post = require( './../lib/post.js' );


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
		var data,
			req;

		data = {
			'beep': 'boop'
		};

		nock( 'https://push.geckoboard.com' )
			.post( '/v1/send/'+opts.widget, {
				'api_key': opts.key,
				'data': data
			})
			.reply( 200 );

		req = post( opts );
		req( data, done );
	});

});
