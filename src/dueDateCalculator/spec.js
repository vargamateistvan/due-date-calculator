"use strict";

const dueDateCalculator = require("./dueDateCalculator");

const dependencies = {
	start: 9,
	end: 17
};

let calculator;

describe("Due Date Calculator tests", () => {
	describe("Invalid dependencies", () => {
		it("no dependencies", () => {
			expect(() => {
				dueDateCalculator();
			}).toThrowError("dependencies is mandatory!");
		});

		it("end missing", () => {
			expect(() => {
				dueDateCalculator({
					start: 1
				});
			}).toThrowError("Workday end is mandatory!");
		});
		
		it("start missing", () => {
			expect(() => {
				dueDateCalculator({
					end: 24
				});
			}).toThrowError("Workday start is mandatory!");
		});

		it("invalid interval", () => {
			expect(() => {
				dueDateCalculator({
					start: 24,
					end: 1
				});
			}).toThrowError("Please add a valid workday interval.")
		});
	});

	describe("Valid dependencies", () => {
		beforeEach(() => {
			calculator = dueDateCalculator(dependencies);
		});

		describe("Invalid inputs", () => {
			it("No input", () => {
				expect(() => {
					calculator();
				}).toThrowError("Please add a report time and estimated time.");
			});

			it("Invalid date", () => {
				expect(() => {
					calculator("Not a date");
				}).toThrowError("Report time should be a date.");
			});

			it("Invalid report date", () => {
				expect(() => {
					calculator(new Date("Sat Feb 16 2019 10:00:00 GMT+0100 (CET)"));
				}).toThrowError("Please add a valid report time during the working hours on workdays.");
			});

			it("Invalid estimated time", () => {
				expect(() => {
					calculator(new Date("Mon Feb 18 2019 10:00:00 GMT+0100 (CET)"), "Not a number");
				}).toThrowError("Estimated time should be a number.");
			});

			it("Invalid estimated number", () => {
				expect(() => {
					calculator(new Date("Mon Feb 18 2019 10:00:00 GMT+0100 (CET)"), -1);
				}).toThrowError("Estimated time should be bigger than 0.");
			});
		});

		describe("Valid inputs", () => {
			it("No overlap", () => {
				const dueDate = calculator(new Date("Mon Feb 18 2019 10:00:00 GMT+0100 (CET)"), 2);
	
				expect(dueDate.toString()).toBe(new Date("Mon Feb 18 2019 12:00:00 GMT+0100 (CET)").toString());
			});
	
			it("Overlapping to the next day", () => {
				const dueDate = calculator(new Date("Mon Feb 18 2019 10:00:00 GMT+0100 (CET)"), 10);
	
				expect(dueDate.toString()).toBe(new Date("Tue Feb 19 2019 12:00:00 GMT+0100 (CET)").toString());
			});
	
			it("Overlapping to the next week", () => {
				const dueDate = calculator(new Date("Mon Feb 18 2019 10:00:00 GMT+0100 (CET)"), 50);
	
				expect(dueDate.toString()).toBe(new Date("Tue Feb 26 2019 12:00:00 GMT+0100 (CET)").toString());
			});
		})
	});
});