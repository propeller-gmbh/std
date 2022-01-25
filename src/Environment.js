const isDevelopment = () => {
	const mode = process.env.NODE_ENV || "development";
		return mode === "development";
};

module.exports = {
	isDevelopment
};