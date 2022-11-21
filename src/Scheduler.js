"use strict";

const {Time}       = require("./Time");
const {log, level} = require("./Log");

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
	callbacks;

	constructor(runEvery = 1 * Time.SECONDS) {
		this.callbacks = [];

		setInterval(() => this.timeStep(), runEvery);
	}

	timeStep() {
		const now        = new Date();
		const seconds    = now.getSeconds();
		const minutes    = now.getMinutes();
		const hours      = now.getHours();
		const dayOfMonth = now.getDate();
		const month      = now.getMonth();
		const dayOfWeek  = now.getDay();;

		for (const callback of this.callbacks) {
			if (typeof callback.seconds === "string" && seconds % parseInt(callback.seconds) !== 0)
				continue;
			else if (typeof callback.seconds === "number" && seconds !== callback.seconds)
				continue;
			if (typeof callback.minutes === "string" && minutes % parseInt(callback.minutes) !== 0)
				continue;
			else if (typeof callback.minutes === "number" && minutes !== callback.minutes)
				continue;
			if (typeof callback.hours === "string" && hours % parseInt(callback.hours) !== 0)
				continue;
			else if (typeof callback.hours === "number" && hours !== callback.hours)
				continue;
			if (typeof callback.dayOfMonth === "string" && dayOfMonth % parseInt(callback.dayOfMonth) !== 0)
				continue;
			else if (typeof callback.dayOfMonth === "number" && dayOfMonth !== callback.dayOfMonth)
				continue;
			if (typeof callback.month === "string" && month % parseInt(callback.month) !== 0)
				continue;
			else if (typeof callback.month === "number" && month !== callback.month)
				continue;
			if (typeof callback.dayOfWeek === "string" && dayOfWeek % parseInt(callback.dayOfWeek) !== 0)
				continue;
			else if (typeof callback.dayOfWeek === "number" && dayOfWeek !== callback.dayOfWeek)
				continue;

			callback.callback();
		}
	}

	register(timeString, callback) {
		this.callbacks.push(new TimeCallback(...Scheduler.ParseTimeString(timeString), callback));
	}

	static ParseTimeString = string => {
		const parts = string.split(/\s/gi);
		
		if (parts.length !== 6) {
			log(level.ERROR`time string '%' is malformed`, string);

			return [];
		}

		for (let i = 0; i < parts.length; i++) {
			const int = parseInt(parts[i]);
			if (isNaN(parts[i])) {
				if (parts[i] === '*') {
					parts[i] = null;
					continue;
				}
				if (!parts[i].match(/\*\/?[1-9]*/)) {
					log(level.ERROR`unknown time indentifier: '%'`, parts[i]);
					return [];
				}
				parts[i] = `${parts[i].split('/')[1]}`;

				// '*/1' is equal to '*'
				if (typeof parts[i] === string && parts[i] === "1")
					parts[i] = null;
				continue;
			}

			parts[i] = int;
		}
		log("parts: %", parts);

		return parts;
	}
}

module.exports = {
	Scheduler
};