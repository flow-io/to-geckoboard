'use strict';

/**
* FUNCTION: onResponse( clbk )
*	Wraps a callback and returns a function to be invoked upon receiving an HTTP response.
*
* @private
* @param {Function} clbk - callback to invoke once finished processing an HTTP response
* @returns {Function} response callback
*/
function onResponse( clbk ) {
	/**
	* FUNCTION: onResponse( error, response, body )
	*	Callback invoked upon receiving an HTTP response.
	*
	* @private
	* @param {Null|Error} error - error object
	* @param {Object} response - HTTP response object
	* @param {Object} body - HTTP response body
	*/
	return function onResponse( error, response, body ) {
		var err, msg;
		if ( error ) {
			return clbk( error );
		}
		if ( response.statusCode !== 200 ) {
			if ( body && body.message ) {
				msg = body.message;
			} else {
				msg = body;
			}
			err = {
				'status': response.statusCode,
				'message': msg
			};
			return clbk( err );
		}
		clbk();
	}; // end FUNCTION onResponse()
} // end FUNCTION onResponse()


// EXPORTS //

module.exports = onResponse;
