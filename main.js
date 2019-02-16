"use_strict";

const dueDateCalculator = require("./src/dueDateCalculator");

try {
	const date1 = new Date("Fri Feb 18 2019 10:30:00")
	const dueDate1 = dueDateCalculator(date1, 3);
	console.log("Starting time:", date1.toString(), "estimated hours:", 3, "it will be done at", dueDate1.toString());

	// Overlap a day
	const date2 = new Date("Fri Feb 18 2019 14:45:00")
	const dueDate2 = dueDateCalculator(date2, 13);
	console.log("Starting time:", date2.toString(), "estimated hours:", 13, "it will be done at", dueDate2.toString());

	// Overlap a weekend
	const date3 = new Date("Fri Feb 18 2019 16:55:00")
	const dueDate3 = dueDateCalculator(date3, 50);
	console.log("Starting time:", date3.toString(), "estimated hours:", 50, "it will be done at", dueDate3.toString());
	
} catch(error) {
	console.error(error);
}