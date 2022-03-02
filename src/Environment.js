const _stack = () => {
	const stack = new Error().stack.split('\n');
	stack.shift(); // Error
	stack.shift(); // call to `_stack()`

	return stack;
}

const here = () => {
	const stack = _stack();
	stack.shift();

	const location = stack.length > 0 ? stack[0] : null;
	const paths    = location.split(' ');

	return paths[paths.length - 1].substring(1, paths[paths.length - 1].length - 2);
}

const isDevelopment = () => {
	const mode = process.env.NODE_ENV || "development";
		return mode === "development";
};

module.exports = {
	isDevelopment,
	here
};