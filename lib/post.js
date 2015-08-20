'use strict';

// MODULES //

var request = require( 'request' ),
	response = require( './response.js' );


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
	* FUNCTION: post( data, next )
	*	Posts data to Geckoboard.
	*
	* @private
	* @param {Object} data - data to post
	* @param {Function} next - callback to invoke after posting data
	*/
	return function post( data, next ) {
		request({
			'method': 'POST',
			'url': url,
			'json': {
				'api_key': key,
				'data': data
			}
		}, response( next ) );
	}; // end FUNCTION post()
} // end FUNCTION post()


// EXPORTS //

module.exports = post;
