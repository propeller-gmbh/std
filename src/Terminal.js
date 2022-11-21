const _log         = console["log"] || (() => {});
const _escapeRegex = /\\%/mg;
const _color       = Object.freeze({ // these are magic numbers for ANSI escape sequences and go here: \u001B[<NUMBER>m
	none          : 0,
	red           : 31,
	black         : 30,
	green         : 32,
	yellow        : 33,
	blue          : 34,
	magenta       : 35,
	cyan          : 36,
	white         : 37,
	blackBright   : 90,
	redBright     : 91,
	greenBright   : 92,
	yellowBright  : 93,
	blueBright    : 94,
	magentaBright : 95,
	cyanBright    : 96,
	whiteBright   : 97
});

/**
 * Wraps a color code into an ANSI escap sequence
 * 
 * @param {int} color 
 * @returns {String} ANSI escape sequence
 */
const COLOR = color => {
	return `\u001B[${color}m`;
};

const _formatObject = obj => {
	let output = JSON.stringify(obj, null , 4);

	return output
			.replace(/([{\[\]}])/mgi, `${COLOR(_color.green)}$1${COLOR(_color.none)}`)                                 // brackets and braces
			.replace(/"(.*)"\s*:/mgi, `${COLOR(_color.blackBright)}$1${COLOR(_color.none)} :`)                         // keys
			.replace(/(:?)(\s+)(?<!".*)([0-9]+\.[0-9]+)/mgi, `$1$2${COLOR(_color.blueBright)}$3${COLOR(_color.none)}`) // floating points
			.replace(/(:?)(\s+)(?<!".*)([0-9]+)(,?)/gmi, `$1$2${COLOR(_color.cyan)}$3${COLOR(_color.none)}$4`)         // integers
			.replace(/:\s*(".*")/mgi, `: ${COLOR(_color.yellowBright)}$1${COLOR(_color.none)}`)                        // strings
			.replace(/:\s*(?<!"\s*)(true|false)/gmi, `: ${COLOR(_color.green)}$1${COLOR(_color.none)}`)                // true/false
			.replace(/(?<!".*)null/gmi, `${COLOR(_color.magenta)}null${COLOR(_color.none)}`);                          // null/undefined
}

module.exports = {
	_log,
	_color,
	COLOR,
	_formatObject,
	_escapeRegex
};