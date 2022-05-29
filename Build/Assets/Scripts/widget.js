import '../Scss/widget.scss';

define(['require','chart.js'], function(require) {
	let $ = require('jquery');
	let chart = require('chart.js');

	Widget.init = function() {
		 console.log("widget");
	};

	// To let the module be a dependency of another module, we return our object
	return Widget;
});