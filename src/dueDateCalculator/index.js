"use-strict";

const dueDateCalculator = require("./dueDateCalculator");

const workingDay = {
	start: 9,
	end: 17
}

module.exports = dueDateCalculator(workingDay);