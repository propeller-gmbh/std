const _stack = () => {
	const stack = new Error().stack.split('\n');
	stack.shift(); // Error
	stack.shift(); // call to `_stack()`

	return stack;
}

const here = (offset = 0) => {
	const stack = _stack();
	stack.shift();

	const location = stack.length > (offset === 0 ? 0 : offset - 1) ? stack[offset] : null;
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