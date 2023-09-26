"use strict";

const {isDevelopment, here} = require("./Environment");
const {sprintf}             = require("./Strings");
const {_log, _color, COLOR} = require("./Terminal");
const {LogObject}           = require("./Classes");


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
	if (!string)
		return;

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
//@Todo : Bug: handle `undefined` arguments
const log = (string, ...args) => {
	if (!string)
		return;
	if (!isDevelopment() && (!(string instanceof LogObject) || !string.fatal))
		return; // we return when log level is not fatal and we are in production mode
	
	const output = sprintf(string, ...args);
	const val    = typeof output === "undefined" ? "undefined" : (output === null ? "null" : output.toString());
	logDirect(`[${caller(1)}] ${val}`, string instanceof LogObject ? string.prefix : "");

	if (string instanceof LogObject && string.fatal)
		process.exit(1); // we exit hard when log level is fatal
};

const assert = (assertion, string, ...args) => {
	if (!isDevelopment())
		return;

	if (assertion !== true) {
		const paths = here(1).split('/').reduce((accumulator, current, index, array) => {
			const divider = accumulator === "" ? "" : "/";
			const color   = index === array.length -1 ? COLOR(_color.yellowBright) : "";
			return `${accumulator}${divider}${color}${current}`;
		}, "");
		_log(paths);
		_log(`${COLOR(_color.red)}\tASSERTION FAILED: ${sprintf(string, ...args)}${COLOR(_color.none)}`);
		process.exit(100);
	}
}

module.exports = {
	LogObject,
	log,
	logDirect,
	level,
	caller,
	assert
};