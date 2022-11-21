const {_color, COLOR} = require("./Terminal");

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

module.exports = {
	LogObject
}