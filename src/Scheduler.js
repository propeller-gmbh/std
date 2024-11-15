"use strict";

const {Time}   = require("./Time");
const {assert} = require("./Log");

class TimeCallback {
	seconds;
	minutes;
	hours;
	dayOfMonth; 
	month;
	dayOfWeek;
	callback;

	// three types are possible:
	// - a number literal: `5`                       -> means "the fifth minute"
	// - a string literal containing a number: `"5"` -> means "every five minutes"
	// - null                                        -> means "does not matter, run always"
	constructor(seconds, minutes, hours, dayOfMonth, month, dayOfWeek, callback) {
		this.seconds    = seconds;
		this.minutes    = minutes;
		this.hours      = hours;
		this.dayOfMonth = dayOfMonth;
		this.month      = month;
		this.dayOfWeek  = dayOfWeek;
		this.callback   = callback;
	}
}

class Scheduler {
	interval;
	runEvery;
	callbacks;

	/**
	 * 
	 * @param {int} runEvery Sets the default interval in which the scheduler will run. Default is every second.
	 * @param  {...any} callbackArguments These arguments well be passed to every callback
	 */
	constructor(runEvery = 1 * Time.SECONDS, ...callbackArguments) {
		this.callbackArguments = callbackArguments;
		this.callbacks         = [];
		this.runEvery          = runEvery;
		this.interval          = null;

		this.clear();
	}

	clear() {
		if (this.interval !== null)
			clearInterval(this.interval);
		this.callbacks = [];
		this.interval  = setInterval(() => this.timeStep(), this.runEvery);
	}

	timeStep() {
		const now        = new Date();
		const seconds    = now.getSeconds();
		const minutes    = now.getMinutes();
		const hours      = now.getHours();
		const dayOfMonth = now.getDate();
		const month      = now.getMonth() + 1;
		const dayOfWeek  = now.getDay();

		// This works on the logic explained on `Scheduler::ParseTimeString`.
		for (const callback of this.callbacks) {
			if (typeof callback.seconds === "string" && seconds % Number(callback.seconds) !== 0)
				continue;
			else if (typeof callback.seconds === "number" && seconds !== callback.seconds)
				continue;
			if (typeof callback.minutes === "string" && minutes % Number(callback.minutes) !== 0)
				continue;
			else if (typeof callback.minutes === "number" && minutes !== callback.minutes)
				continue;
			if (typeof callback.hours === "string" && hours % Number(callback.hours) !== 0)
				continue;
			else if (typeof callback.hours === "number" && hours !== callback.hours)
				continue;
			if (typeof callback.dayOfMonth === "string" && dayOfMonth % Number(callback.dayOfMonth) !== 0)
				continue;
			else if (typeof callback.dayOfMonth === "number" && dayOfMonth !== callback.dayOfMonth)
				continue;
			if (typeof callback.month === "string" && month % Number(callback.month) !== 0)
				continue;
			else if (typeof callback.month === "number" && month !== callback.month)
				continue;
			if (typeof callback.dayOfWeek === "string" && dayOfWeek % Number(callback.dayOfWeek) !== 0)
				continue;
			else if (typeof callback.dayOfWeek === "number" && dayOfWeek !== callback.dayOfWeek)
				continue;

			callback.callback(...this.callbackArguments);
		}
	}

	/**
	 * Register a scheduled callback
	 * 
	 * The `timeString` argument takes a syntax very similar to the linux crontab:
	 * 
	 * - a number means the literal number - i.e. `5` on the "minutes" place means "on the fifth minute"
	 * - a `*` means every unit - i.e. `*` on the "hours" place means "every hour"
	 * * `* /n` means every "nth" unit - i.e. `* /6` on the "seconds" place means "every six seconds"
	 * ––– (spaces between '*' and '/' in the line above are only to prevent this comment from blowing up) –––
	 * 
	 * ``` 
	 * *    *    *    *    *    *
	 * ┬    ┬    ┬    ┬    ┬    ┬
	 * │    │    │    │    │    │
	 * │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
	 * │    │    │    │    └───── month (1 - 12)
	 * │    │    │    └────────── day of month (1 - 31)
	 * │    │    └─────────────── hours (0 - 23)
	 * │    └──────────────────── minutes (0 - 59)
	 * └───────────────────────── seconds (0 - 59)
	 * ```
	 *  
	 * @param {string}   timeString 
	 * @param {function} callback 
	 */
	register(timeString, callback) {
		assert(typeof callback === "function", "the 'callback' parameter has to be a function/callable");
		this.callbacks.push(new TimeCallback(...Scheduler.ParseTimeString(timeString), callback));
	}

	/**
	 * Here we return a argument list for the constructor of `TimeCallback`
	 * 
	 * The actual data type of a member influences future handling inside
	 * `Scheduler::timeStep()`:
	 * - if it is of type `Number`, it matches the literal unit (6, "every sixth unit")
	 * - if it is of type `string`, it matches for every "nth" units (* /6)
	 * - if it is `null`, it always matches (*)
	 * 
	 * @param {string} string The action time format string (crontab-like) 
	 * @returns {array}  The arguments for the constructor of `TimeCallback`
	 * @see TimeCallback
	 */
	static ParseTimeString = string => {
		const parts = string.split(/\s/gi);

		assert(parts.length === 6, "time string '%' is malformed", string);

		for (let i = 0; i < parts.length; i++) {
			const int = Number(parts[i]);
			if (isNaN(parts[i])) {
				if (parts[i] === '*') {
					parts[i] = null;
					continue;
				}
				assert(parts[i].match(/\*\/?[1-9]*/) !== null, "unknown time indentifier: '%'", parts[i]);
				parts[i] = `${parts[i].split('/')[1]}`;

				// '*/1' is equal to '*'
				if (typeof parts[i] === string && parts[i] === "1")
					parts[i] = null;
				continue;
			}
			parts[i] = int;
		}

		return parts;
	}
}

module.exports = {
	Scheduler
};
