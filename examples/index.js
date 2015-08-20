'use strict';

var Stream = require( './../lib' );

var oStream,
	data,
	i;

oStream = new Stream({
	'key': '<your_key_goes_here>', // INSERT KEY HERE //
	'id': '<your_widget_id_goes_here>' // INSERT WIDGET ID HERE //
});

function write( data ) {
	return function() {
		oStream.write( JSON.stringify( data ) );
	};
}

function end() {
	oStream.end();
}

for ( i = 0; i < 100; i++ ) {
	data = {
		'item': Math.random() * 100,
		'min': {
			'value': 0
		},
		'max': {
			'value': 100
		}
	};
	// Stagger posting values to Geckoboard:
	setTimeout( write( data ), i*1000 );
}

// Close the stream:
setTimeout( end, i*1000 );


