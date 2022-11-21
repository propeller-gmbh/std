class EnumValue {
	_value;
	_name;
	_type;

	constructor(value, name, type) {
		this._value = value;
		this._name  = name;
		this._type  = type;
	}

	get name() {
		return this._name;
	}

	typeof(name) {
		return name === this._type;
	}

	valueOf() {
		return this._value;
	}

	toJSON() {
		return this._value;
	}
}

class EnumClass {
	constructor(values) {
		for (const [key, object] of Object.entries(values))
			this[key] = Object.freeze(object);
	}

	toJSON() {
		return Object.entries(this).filter((name, _) => name.toString().charAt(0) !== '_').map(item => item[1].valueOf()).sort();
	}
}

const Enum = (values, name) => {
	let enumeration = {};

	for (const [key, value] of Object.entries(values))
		enumeration[key] = new EnumValue(value, key, name);

	return Object.freeze(new EnumClass(enumeration));
};

let CUR_IOTA = 0;
const iota = (reset) => {
	if (reset) {
		if (reset === true) {
		
			const iota = CUR_IOTA;
			CUR_IOTA = 0;
			return iota;
		} else {
			CUR_IOTA = reset;
		}
	}

	return CUR_IOTA++;
};

module.exports = {
	Enum,
	iota
}