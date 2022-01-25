/**
 * Provides a standard library for often used functions
 *
 * @author Michael Ochmann <michael.ochmann@propeller.de>
 */

const {Log, LogLevel, LogDirect} = require("./src/Log");
const {ucFirst}                  = require("./src/Strings");
const {isDevelopment}            = require("./src/Environment");
const {Time}                     = require("./src/Time");
const {rand}                     = require("./src/Math");

module.exports = {
	Log,
	LogDirect,
	LogLevel,
	ucFirst,
	isDevelopment,
	Time,
	rand
};

