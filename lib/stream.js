'use strict';

// MODULES //

var Writable = require( 'readable-stream' ).Writable,
	copy = require( 'utils-copy' ),
	validate = require( './validate.js' ),
	post = require( './post.js' );


// VARIABLES //

var DEFAULTS = require( './defaults.json' );


// STREAM //

/**
* FUNCTION: Stream( options )
*	Writable stream constructor.
*
* @constructor
* @param {Object} options - stream options
* @param {String} options.key - API key
* @param {String} options.id - widget id
* @param {Boolean} [options.objectMode=false] - specifies whether stream should operate in object mode
* @param {Boolean} [options.decodeStrings=true] - specifies whether written strings should be decoded into Buffer objects
* @param {Number} [options.highWaterMark=16] - specifies the Buffer level for when `write()` starts returning `false`
* @returns {Stream} Writable stream
*/
function Stream( options ) {
	var opts,
		err;

	if ( !arguments.length ) {
		throw new Error( 'insufficient input arguments. Must provide stream options.' );
	}
	if ( !( this instanceof Stream ) ) {
		return new Stream( options );
	}
	opts = copy( DEFAULTS );
	if ( arguments.length ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	Writable.call( this, opts );
	this._post = post( opts );
	this._destroyed = false;
	this._mode = opts.objectMode;
	return this;
} // end FUNCTION Stream()

/**
* Create a prototype which inherits from the parent prototype.
*/
Stream.prototype = Object.create( Writable.prototype );

/**
* Set the constructor.
*/
Stream.prototype.constructor = Stream;

/**
* METHOD: _write( chunk, encoding, clbk )
*	Implements the `_write` method to send data to Geckoboard.
*
* @private
*/
Stream.prototype._write = function( chunk, encoding, clbk ) {
	var data = JSON.parse( chunk.toString() );
	this._post( data, clbk );
}; // end METHOD _write()

/**
* METHOD: destroy( [error] )
*	Gracefully destroys a stream, providing backwards compatibility.
*
* @param {Object} [error] - optional error message
* @returns {Stream} Stream instance
*/
Stream.prototype.destroy = function( error ) {
	if ( this._destroyed ) {
		return;
	}
	var self = this;
	this._destroyed = true;
	process.nextTick( destroy );

	return this;

	/**
	* FUNCTION: destroy()
	*	Emits a `close` event.
	*
	* @private
	*/
	function destroy() {
		if ( error ) {
			self.emit( 'error', error );
		}
		self.emit( 'close' );
	}
}; // end METHOD destroy()


// EXPORTS //

module.exports = Stream;

