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
		throw new Error("Please add a valid workday interval.");
	}

	const workingHours = workingDayEnd - workingDayStart;

	function isValidReportTime(reportDate) {
		const day = reportDate.getDay();
		const hour = reportDate.getHours();

		// Filter weekdays
		// 0 - Sunday, 6 - Saturday
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

	function getOverlapDate(date, turnAroundTime) {
		let days = turnAroundTime.days;

		// if hours overlaps another day
		if (date.getHours() + turnAroundTime.hours >= workingDayEnd) {
			days++;
		}

		// if it weekend
		if (date.getDay() + turnAroundTime.days > 5) {
			days += 2;
		}

		// if remaing hours bigger than workinghours
		const hours = (date.getHours() + turnAroundTime.hours - workingDayStart) % workingHours;

		return {
			days,
			hours
		}
	}

	function calculate(reportDate, turnaround) {
		if (!reportDate && !turnaround) {
			throw new Error("Please add a report time and estimated time.");
		}

		if (!(reportDate instanceof Date)) {
			throw new Error("Report time should be a date.");
		}

		if (!isValidReportTime(reportDate)) {
			throw new Error("Please add a valid report time during the working hours on workdays.");
		}

		if (typeof turnaround !== "number") {
			throw new Error("Estimated time should be a number.");
		}

		if (turnaround < 0) {
			throw new Error("Estimated time should be bigger than 0.");
		}

		const dueDate = new Date(reportDate);

		if (reportDate.getHours() + turnaround < workingDayEnd) {
			dueDate.setHours(dueDate.getHours() + turnaround);
			return dueDate;
		}

		const turnAroundTime = getTournaround(turnaround);
		const overlapDates = getOverlapDate(reportDate, turnAroundTime);

		dueDate.setDate(dueDate.getDate() + overlapDates.days);
		dueDate.setHours(workingDayStart + overlapDates.hours);

		return dueDate;
	}

	return calculate;
}