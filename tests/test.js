const {log, level, assert, Time, Scheduler} = require("../index");


const LogTest = () => {
	const foo = 10;
	const bar = {
		value   : 50,
		string  : "this is a string",
		float   : 0.56,
		myArray : [
			1, 2, 3, 4, 0.44
		],
		dumbFunction : lol => {
			return lol;
		}
	};
	const baz = {
		integer  : 50,
		float    : 3.14159652,
		string   : "this is just a test",
		stringNo : "this is a string with a number 566 and a float 55.55",
		array    : [
			1, 2, 3
		],
		obj      : {
			foo : "A",
			bar : true,
			baz : false,
			nil : null,
			nol : "a null value"
		}
	};
	const myArray = [1, 3, 4];

	log("this is a normal string");
	log("in this string, this '%' gets replaced with the number five and this not '\\%'", 5);
	log("this string contains % as an object", bar);
	log("this string contains % as an array", myArray);
	log("this is a null (%) string, and this an undefined one (%)", null, undefined);
	log(level.WARN`this template literal contains % as an object`, bar);
	log("this: % is another object.", baz);
	log(level.INFO`this is just informational because foo (${foo}) is %`, foo);
	log(level.WARN`in this literal, this '%' gets replaced with the number five and this not '\\%'`, 5);
	log(level.SUCCESS`success!`);
	log(level.ERROR`ERROR -> this is an error`);
};

const AssertionTest = () => {
	const value = 10;

	assert(value === 5, `expected value to be 5, actually is '%'`, value);
}

const scheduler = new Scheduler(1 * Time.SECONDS, "foo", "bar");

scheduler.register("* * * * * *", async (str1, str2) => {
	log("string1 : %, string2: %", str1, str2);
});

LogTest();
AssertionTest();