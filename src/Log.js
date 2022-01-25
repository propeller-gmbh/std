const chalk = require("chalk");

const {isDevelopment} = require("./Environment");

const LogDirect = (message, level = LogLevel.NORMAL) => {
	if (!isDevelopment && ![
		LogLevel.ERROR,
		LogLevel.PANIC,
		LogLevel.SUCCESS
	].includes(level))
		return;

	let date   = new Date();
	let render = null;

	switch (level) {
		case LogLevel.ERROR:
		case LogLevel.PANIC:
			render = chalk.red;
			break;
		case LogLevel.INFO:
			render = chalk.blue;
			break;
		case LogLevel.SUCCESS:
			render = chalk.green;
			break;
		case LogLevel.WARN:
			render = chalk.yellow;
			break;
		case LogLevel.NORMAL:
		default:
			render = function (message) {
				return message;
			};
			break;
	}
	console.log(render(`${date.toDateString()} ${date.toLocaleTimeString()}\t${message}`));

	if (level === LogLevel.PANIC)
		process.exit(1);
}

const Log = (message, level) => {
	const caller = GetCaller(1);
	LogDirect(`[${caller}] ${message}`, level);
}

/*
 * this magic is nessecary, because reflcetion of `callee.caller` is not availbale in strict mode
 */
const GetCaller = (offset = 0) => {
	try {
		throw new Error();
	} catch (error) {
		var callerName = error.stack.replace(/^Error\s+/, '');
		callerName = callerName.split("\n")[offset + 1];

		return callerName.replace(/ \(.+\)$/, '').replace(/(at|new) /gi, "").replace(".<anonymous>", "").trim();
	}
}
const LogLevel = Object.freeze({
	NORMAL  : 1,
	INFO    : 2,
	ERROR   : 3,
	SUCCESS : 4,
	WARN    : 5,
	PANIC   : 6
});

module.exports = {
	LogDirect,
	LogLevel,
	Log
};