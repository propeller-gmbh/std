"use strict";

const {isDevelopment} = require("./Environment");

const _log         = console["log"] || (() => {});
const _paramRegex  = /(?<!\\)(%)/mg;
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
			.replace(/([{\[\]}])/mgi, `${COLOR(_color.green)}$1${COLOR(_color.none)}`)                         // brackets and braces
			.replace(/"(.*)"\s*:/mgi, `${COLOR(_color.blackBright)}$1${COLOR(_color.none)} :`)                 // keys
			.replace(/(:?)(\s+)([0-9]+\.[0-9]+)/mgi, `$1$2${COLOR(_color.blueBright)}$3${COLOR(_color.none)}`) // floating points
			.replace(/\:\s*([0-9]+)\s*,/mgi, `: ${COLOR(_color.cyanBright)}$1${COLOR(_color.none)},`)          // integers
			.replace(/(\s+)([0-9]+)(\s*)(,?)/mgi, `$1${COLOR(_color.cyanBright)}$2${COLOR(_color.none)}$3$4`)  // integers in arrays
			.replace(/:\s*(".*")/mgi, `: ${COLOR(_color.yellowBright)}$1${COLOR(_color.none)}`);               // strings
}

/*
 * this magic is nessecary, because reflcetion of `callee.caller` is not availbale in strict mode
 *
 * @author Michael Ochmann <michael.ochmann@propeller.de>
 */
const caller = (offset = 0) => {
	try {
		throw new Error();
	} catch (error) {
		var callerName = error.stack.replace(/^Error\s+/, '');
		callerName = callerName.split("\n")[offset + 1];

		return callerName.replace(/ \(.+\)$/, '').replace(/(at|new) /gi, "").replace(".<anonymous>", "").trim();
	}
}

/**
 * LogObject constructs a string from a tagged template literal
 * 
 * it also holds the color the string should be and if the reporting of it came
 * with any fatal errors.
 */
class LogObject {
	constructor(strings, values, color = _color.none, fatal = false) {
		this.fatal   = fatal;
		this.strings = strings;
		this.values  = values;
		this.prefix  = COLOR(color);
	}

	/**
	 * cobbles together a string from provided tagged template literal params
	 * 
	 * @returns {String} assembled string
	 */
	toString() {
		let output = "";
		let i      = 0;
		for (const string of this.strings) {
			output += string;
			if (i < this.values.length)
				output += this.values[i].toString();
			i++;
		}
		output += COLOR(_color.none);

		return output;
	}
}

const level = Object.freeze({
	NORMAL  : (texts, ...args) => new LogObject(texts, args, _color.none),
	INFO    : (texts, ...args) => new LogObject(texts, args, _color.cyan),
	SUCCESS : (texts, ...args) => new LogObject(texts, args, _color.green),
	WARN    : (texts, ...args) => new LogObject(texts, args, _color.yellow),
	ERROR   : (texts, ...args) => new LogObject(texts, args, _color.red),
	PANIC   : (texts, ...args) => new LogObject(texts, args, _color.red, true)
});

/**
 * logs directly without prepeding by the use of `caller`
 * 
 * @param {String} string 
 * @param {String} prefix 
 */
const logDirect = (string, prefix = "") => {
	const date = new Date();
	_log(`${prefix}${date.toDateString()} ${date.toLocaleTimeString()}\t${string.toString()}`);
};

/**
 * Standard log function
 * 
 * Takes a string or a template literal and logs it to the console while
 * coloring it depending on the log level. Log level is provided as a tag to a
 * template literal.
 * Can be used similarly to the infamous `printf`, where it accepts varargs
 * after the message string and every '%' inside the string gets replaced with
 * the corresponding vararg. To print a literal '%', it hast to be escaped like
 * such: '\\%'.
 * it exits the program when log level fatal is detected and skips logging
 * alltogether when in production mode.
 * 
 * @param {String|LogObject} string 
 * @param {...any} args 
 * 
 * @author Michael Ochmann <michael.ochmann@propeller.de>
 */
const log = (string, ...args) => {
	if (!isDevelopment() && (!(string instanceof LogObject) || !string.fatal))
		return; // we return when log level is not fatal and we are in production mode
	
	let output = string;

	const count = ((string.toString() || "").match(_paramRegex) || []).length || 0;
	if (args.length > 0 || count > 0) {
		if (count !== args.length)
			throw new RangeError(`log string argument mismatch, required ${count} got ${args.length}.`); // we throw an error when argument count does not match
		const values = [];
		for (const arg of args) {
			if (typeof arg === "object")
				values.push(_formatObject(arg) + (string instanceof LogObject ? string.prefix : COLOR(_color.none)));
			else
				values.push(arg);
		}
		output = string.toString().replace(_paramRegex, _ => values.shift().toString()).replace(_escapeRegex, "%");
	}
	logDirect(`[${caller(1)}] ${output.toString()}`, string instanceof LogObject ? string.prefix : "");

	if (string instanceof LogObject && string.fatal)
		process.exit(1); // we exit hard when log level is fatal
};

module.exports = {
	log,
	logDirect,
	level,
	caller
};