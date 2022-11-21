const {_log, _color, COLOR, _escapeRegex, _formatObject} = require("./Terminal");
const {LogObject}                                        = require("./Classes");

const _paramRegex  = /(?<!\\)(%)/mg;

const ucFirst = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const sprintf = (string, ...args) => {
	let output = string;

	const count = ((string.toString() || "").match(_paramRegex) || []).length || 0;
	if (args.length > 0 || count > 0) {
		if (count !== args.length)
			throw new RangeError(`log string argument mismatch, required ${count} got ${args.length}.`); // we throw an error when argument count does not match
		const values = [];
		for (const arg of args) {
			if (typeof arg === "object")
				values.push(_formatObject(arg) + (string instanceof LogObject ? string.prefix : COLOR(_color.none)));
			else if (typeof arg === "undefined")
				values.push("undefined");
			else if (arg === null)
				values.push("null");
			else
				values.push(arg);
		}
		output = string.toString().replace(_paramRegex, _ => values.shift().toString()).replace(_escapeRegex, "%");
	}

	return output;
};

const printf = (string, ...args) => {
	_log(sprintf(string, ...args));
}

module.exports = {
	ucFirst,
	printf,
	sprintf
};