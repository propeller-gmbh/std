const {log, level} = require("../index");


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
	const myArray = [1, 3, 4];

	log("this is a normal string");
	log("in this string, this '%' gets replaced with the number five and this not '\\%'", 5);
	log("this string contains % as an object", bar);
	log("this string contains % as an array", myArray);
	log(level.WARN`this template literal contains % as an object`, bar);
	log(level.INFO`this is just informational because foo (${foo}) is %`, foo);
	log(level.WARN`in this literal, this '%' gets replaced with the number five and this not '\\%'`, 5);
	log(level.SUCCESS`success!`);
	log(level.ERROR`ERROR -> this is an error`);
};

LogTest();