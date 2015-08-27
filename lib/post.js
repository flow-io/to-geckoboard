'use strict';

// MODULES //

var request = require( 'request' );


// VARIABLES //

var BASE = 'https://push.geckoboard.com/v1/send/';


// POST //

/**
* FUNCTION: post( opts )
*	Returns a function to post data to Geckoboard.
*
* @param {Object} opts - function options
* @param {String} options.key - API key
* @param {String} options.id - widget id
* @returns {Function} function to post data to Geckoboard
*/
function post( opts ) {
	var key = opts.key,
		url;

	url = BASE + opts.widget;

	/**
	* FUNCTION: post( data, clbk )
	*	Posts data to Geckoboard.
	*
	* @private
	* @param {Object} data - data to post
	* @param {Function} clbk - callback to invoke after posting data
	*/
	return function post( data, clbk ) {
		request({
			'method': 'POST',
			'url': url,
			'json': {
				'api_key': key,
				'data': data
			}
		}, clbk );
	}; // end FUNCTION post()
} // end FUNCTION post()


// EXPORTS //

module.exports = post;
