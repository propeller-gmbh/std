const {log, level} = require("../index");


const LogTest = () => {
	log("this is a normal string");
	log("in this string, this '%' gets replaced with the number five and this not '\\%'", 5);
	log(level.INFO`this is just informational`);
	log(level.WARN`in this literal, this '%' gets replaced with the number five and this not '\\%'`, 5);
	log(level.SUCCESS`success!`);
	log(level.ERROR`ERROR -> this is an error`);
};

LogTest();