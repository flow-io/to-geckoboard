'use strict';

// MODULES //

var Transform = require( 'readable-stream' ).Transform,
	copy = require( 'utils-copy' ),
	parse = require( 'utils-json-parse' ),
	validate = require( './validate.js' ),
	post = require( './post.js' ),
	response = require( './response.js' );


// VARIABLES //

var DEFAULTS = require( './defaults.json' );


// STREAM //

/**
* FUNCTION: Stream( options )
*	Transform stream constructor.
*
* @constructor
* @param {Object} options - stream options
* @param {String} options.key - API key
* @param {String} options.id - widget id
* @param {Boolean} [options.objectMode=false] - specifies whether stream should operate in object mode
* @param {Number} [options.highWaterMark=16] - specifies the Buffer level for when `write()` starts returning `false`
* @param {Boolean} [options.allowHalfOpen=false] - specifies whether a stream should remain open even if one side ends
* @returns {Stream} Transform stream
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
	err = validate( opts, options );
	if ( err ) {
		throw err;
	}
	// The stream converts each chunk into a string so no need to decode written strings as Buffer objects:
	opts.decodeStrings = false;

	// Make the stream a Transform stream:
	Transform.call( this, opts );

	// Cache whether the stream operates in objectMode:
	this._objectMode = opts.objectMode;

	// Create a method for posting data to Geckoboard:
	this._post = post( opts );

	// Data id:
	this._id = -1;

	// Flag specifying whether a stream has been destroyed:
	this._destroyed = false;

	return this;
} // end FUNCTION Stream()

/**
* Create a prototype which inherits from the parent prototype.
*/
Stream.prototype = Object.create( Transform.prototype );

/**
* Set the constructor.
*/
Stream.prototype.constructor = Stream;

/**
* METHOD: _transform( chunk, encoding, clbk )
*	Implements the `_transform` method to send data to Geckoboard.
*
* @private
* @param {Buffer|String|*} chunk - streamed chunk
* @param {String} encoding - Buffer encoding
* @param {Function} clbk - callback to invoke after processing a streamed chunk
*/
Stream.prototype._transform = function _transform( chunk, encoding, clbk ) {
	var self = this,
		fcn;
	if ( !this._objectMode ) {
		if ( encoding === 'buffer' ) {
			chunk = chunk.toString();
		}
		chunk = parse( chunk );
		if ( chunk instanceof Error ) {
			return done( chunk );
		}
	}
	this._id += 1;
	fcn = response( done );
	this._post( chunk, fcn );

	/**
	* FUNCTION: done( error )
	*	Callback invoked after posting data.
	*
	* @private
	* @param {Error|Null} error - error object
	*/
	function done( error ) {
		var out;
		if ( error ) {
			if ( error instanceof Error ) {
				// Will cause the stream to emit an `error` and `unpipe`...
				return clbk( error );
			}
			out = error;
			out._id = self._id.toString();
		} else {
			out = {
				'_id': self._id.toString(),
				'status': 200,
				'message': 'Success'
			};
		}
		self.push( JSON.stringify( out )+'\n', 'utf8' );
		clbk();
	}
}; // end METHOD _transform()

/**
* METHOD: destroy( [error] )
*	Gracefully destroys a stream, providing backwards compatibility.
*
* @param {Object} [error] - optional error message
* @returns {Stream} Stream instance
*/
Stream.prototype.destroy = function destroy( error ) {
	if ( this._destroyed ) {
		return;
	}
	var self = this;
	this._destroyed = true;
	process.nextTick( close );

	return this;

	/**
	* FUNCTION: close()
	*	Emits a `close` event.
	*
	* @private
	*/
	function close() {
		if ( error ) {
			self.emit( 'error', error );
		}
		self.emit( 'close' );
	}
}; // end METHOD destroy()


// EXPORTS //

module.exports = Stream;

