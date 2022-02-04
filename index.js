/**
 * Provides a standard library for often used functions
 *
 * @author Michael Ochmann <michael.ochmann@propeller.de>
 */

const {log, level, logDirect} = require("./src/Log");
const {ucFirst}                  = require("./src/Strings");
const {isDevelopment}            = require("./src/Environment");
const {Time}                     = require("./src/Time");
const {rand}                     = require("./src/Math");

module.exports = {
	log,
	logDirect,
	level,
	ucFirst,
	isDevelopment,
	Time,
	rand
};
