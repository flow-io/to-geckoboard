'use strict';

// MODULES //

var copy = require( 'utils-copy' ),
	Stream = require( './stream.js' );


// FACTORY //

/**
* FUNCTION: streamFactory( options )
*	Creates a reusable stream factory.
*
* @param {Object} options - Writable stream options
* @param {String} options.key - API key
* @param {String} options.id - widget id
* @param {Boolean} [options.objectMode=false] - specifies whether stream should operate in object mode
* @param {Number} [options.highWaterMark=16] - specifies the Buffer level for when `write()` starts returning `false`
* @param {Boolean} [options.allowHalfOpen=false] - specifies whether a stream should remain open even if one side ends
* @returns {Function} stream factory
*/
function streamFactory( options ) {
	var opts;
	if ( !arguments.length ) {
		throw new Error( 'insufficient input arguments. Must provide stream options.' );
	}
	opts = copy( options );
	/**
	* FUNCTION: createStream()
	*	Creates a stream.
	*
	* @returns {Stream} Writable stream
	*/
	return function createStream() {
		return new Stream( opts );
	};
} // end METHOD streamFactory()


// EXPORTS //

module.exports = streamFactory;
