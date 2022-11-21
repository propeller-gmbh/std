/**
 * Provides a standard library for often used functions
 *
 * @author Michael Ochmann <michael.ochmann@propeller.de>
 */

const {log, level, logDirect, assert} = require("./src/Log");
const {ucFirst, sprintf, printf}      = require("./src/Strings");
const {isDevelopment, here}           = require("./src/Environment");
const {Time}                          = require("./src/Time");
const {rand}                          = require("./src/Math");
const {Enum, iota}                    = require("./src/Enum");
const {Scheduler}                     = require("./src/Scheduler");

module.exports = {
	log,
	logDirect,
	level,
	assert,
	ucFirst,
	sprintf,
	printf,
	isDevelopment,
	here,
	Time,
	Scheduler,
	rand,
	Enum,
	iota
};

