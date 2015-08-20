/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	validate = require( './../lib/validate.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'validate', function tests() {

	it( 'should export a function', function test() {
		expect( validate ).to.be.a( 'function' );
	});

	it( 'should return an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			function(){},
			[]
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( validate( {}, values[ i ] ) instanceof TypeError );
		}
	});

	it( 'should require key and widget options', function test() {
		expect( foo ).to.throw( Error );
		expect( bar ).to.throw( Error );
		expect( beep ).to.throw( Error );
		expect( boop ).to.not.throw( Error );
		function foo() {
			var err = validate( {}, {
				'widget': '1234'
			});
			if ( err ) {
				throw err;
			}
		}
		function bar() {
			var err = validate( {}, {
				'key': '1234'
			});
			if ( err ) {
				throw err;
			}
		}
		function beep() {
			var err = validate( {}, {} );
			if ( err ) {
				throw err;
			}
		}
		function boop() {
			var err = validate( {}, {
				'key': '1234',
				'widget': '1234'
			});
			if ( err ) {
				throw err;
			}
		}
	});

	it( 'should return an error if provided a key option which is not a string primitive', function test() {
		var values, err;

		values = [
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'key': values[ i ],
				'widget': '123'
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a widget id option which is not a string primitive', function test() {
		var values, err;

		values = [
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'key': '123',
				'widget': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided an object mode option which is not a boolean primitive', function test() {
		var values, err;

		values = [
			5,
			'5',
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'key': '1234',
				'widget': '1234',
				'objectMode': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a decode strings option which is not a boolean primitive', function test() {
		var values, err;

		values = [
			5,
			'5',
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'key': '1234',
				'widget': '1234',
				'decodeStrings': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return an error if provided a high water mark option which is not a nonnegative number', function test() {
		var values, err;

		values = [
			-5,
			'5',
			undefined,
			null,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			err = validate( {}, {
				'key': '1234',
				'widget': '1234',
				'highWaterMark': values[ i ]
			});
			assert.isTrue( err instanceof TypeError );
		}
	});

	it( 'should return null if all options are valid', function test() {
		var err;

		err = validate( {}, {
			'key': '1234',
			'widget': '5678',
			'objectMode': true,
			'decodeStrings': false,
			'highWaterMark': 64
		});

		assert.isNull( err );

		err = validate( {}, {
			'key': '1234',
			'widget': '1234',
			'beep': true, // misc options
			'boop': 'bop'
		});

		assert.isNull( err );
	});

});
