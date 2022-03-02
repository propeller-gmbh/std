/**
 * Provides a standard library for often used functions
 *
 * @author Michael Ochmann <michael.ochmann@propeller.de>
 */

const {log, level, logDirect, assert} = require("./src/Log");
const {ucFirst}                       = require("./src/Strings");
const {isDevelopment, here}           = require("./src/Environment");
const {Time}                          = require("./src/Time");
const {rand}                          = require("./src/Math");

module.exports = {
	log,
	logDirect,
	level,
	assert,
	ucFirst,
	isDevelopment,
	here,
	Time,
	rand
};
