'use strict';

// MODULES //

var copy = require( 'utils-copy' ),
	Stream = require( './stream.js' );


// OBJECT MODE //

/**
* FUNCTION: objectMode( options )
*	Returns a stream with `objectMode` set to `true`.
*
* @param {Object} options - Writable stream options
* @param {String} options.key - API key
* @param {String} options.id - widget id
* @param {Boolean} [options.objectMode=false] - specifies whether stream should operate in object mode
* @param {Number} [options.highWaterMark=16] - specifies the Buffer level for when `write()` starts returning `false`
* @param {Boolean} [options.allowHalfOpen=false] - specifies whether a stream should remain open even if one side ends
* @returns {Stream} Writable stream
*/
function objectMode( options ) {
	var opts;
	if ( !arguments.length ) {
		throw new Error( 'unsufficient input arguments. Must provide stream options.' );
	}
	opts = copy( options );
	opts.objectMode = true;
	return new Stream( opts );
} // end FUNCTION objectMode()


// EXPORTS //

module.exports = objectMode;
