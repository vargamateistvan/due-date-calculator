"use_strict";

module.exports = (dependencies) => {
	if (!dependencies) {
		throw new Error("dependencies is mandatory!");
	}

	if (!dependencies.start) {
		throw new Error("Workday start is mandatory!");
	}

	if (!dependencies.end) {
		throw new Error("Workday end is mandatory!");
	}

	const workingDayStart = dependencies.start;
	const workingDayEnd = dependencies.end;

	if (workingDayStart >= workingDayEnd) {
		throw new Error("Please add a valid workday.");
	}

	const workingHours = workingDayEnd - workingDayStart;

	function isValidReportTime(reportDate) {
		const day = reportDate.getDay();
		const hour = reportDate.getHours();

		// Filter weekdays
		if (day === 6 || day === 0) {
			return false;
		}

		// Filter not working hours
		if (hour < workingDayStart || hour >= workingDayEnd) {
			return false;
		}

		return true;
	}

	function getTournaround(turnaround) {
		const days = Math.floor(turnaround / workingHours);
		const hours = turnaround % workingHours;

		return {
			days,
			hours
		}
	}

	function getOverlapDays(date, turnaroundTime) {
		let days = turnaroundTime.days;

		// if hours overlaps another day
		if (date.getHours() + turnaroundTime.hours >= workingDayEnd) {
			days++;
		}

		// if it weekend
		if (date.getDay() + turnaroundTime.days > 5) {
			days += 2;
		}

		return days;
	}

	function getOverlapHours(date, turnaroundTime) {
		return (date.getHours() + turnaroundTime.hours - workingDayStart) % workingHours;
	}

	function addDays(date, days) {
		date.setDate(date.getDate() + days);
	}

	function addHours(date, hours, toWorkingStartDate) {
		date.setHours(toWorkingStartDate ? workingDayStart + hours : date.getHours() + hours);
	}

	function calculate(reportDate, turnaround) {
		if (!reportDate && !turnaround) {
			throw new Error("Please add a report time and estimated time");
		}

		if (!reportDate instanceof Date) {
			throw new Error("Report time should be a date");
		}

		if (!isValidReportTime(reportDate)) {
			throw new Error("Please add a valid report time during the working hours on workdays");
		}

		if (typeof turnaround !== "number") {
			throw new Error("Estimated time should be a number");
		}

		if (turnaround < 0) {
			throw new Error("Estimated time should be bigger than 0");
		}

		const dueDate = new Date(reportDate);

		if (reportDate.getHours() + turnaround < workingDayEnd) {
			addHours(dueDate, turnaround);
			return dueDate;
		}

		const turnaroundTime = getTournaround(turnaround);
		
		turnaroundTime.days = getOverlapDays(reportDate, turnaroundTime);
		turnaroundTime.hours = getOverlapHours(reportDate, turnaroundTime);
		console.log("TURNAROUND TIME", turnaroundTime);

		addDays(dueDate, turnaroundTime.days);
		addHours(dueDate, turnaroundTime.hours, true);

		return dueDate;
	}

	return calculate;
}