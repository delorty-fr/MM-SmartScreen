const helpers = require("../helpers/global-setup");

describe("Compliments module", () => {

	/**
	 * move similar tests in function doTest
	 * @param {Array} complimentsArray The array of compliments.
	 * @returns {boolean} result
	 */
	const doTest = async (complimentsArray) => {
		let elem = await helpers.waitForElement(".compliments");
		expect(elem).not.toBeNull();
		elem = await helpers.waitForElement(".module-content");
		expect(elem).not.toBeNull();
		expect(complimentsArray).toContain(elem.textContent);
		return true;
	};

	afterAll(async () => {
		await helpers.stopApplication();
	});

	describe("Feature anytime in compliments module", () => {
		describe("Set anytime and empty compliments for morning, evening and afternoon", () => {
			beforeAll(async () => {
				await helpers.startApplication("tests/configs/modules/compliments/compliments_anytime.js");
				await helpers.getDocument();
			});

			it("shows anytime because if configure empty parts of day compliments and set anytime compliments", async () => {
				await expect(doTest(["Anytime here"])).resolves.toBe(true);
			});
		});

		describe("Only anytime present in configuration compliments", () => {
			beforeAll(async () => {
				await helpers.startApplication("tests/configs/modules/compliments/compliments_only_anytime.js");
				await helpers.getDocument();
			});

			it("shows anytime compliments", async () => {
				await expect(doTest(["Anytime here"])).resolves.toBe(true);
			});
		});
	});

	describe("remoteFile option", () => {
		beforeAll(async () => {
			await helpers.startApplication("tests/configs/modules/compliments/compliments_remote.js");
			await helpers.getDocument();
		});

		it("should show compliments from a remote file", async () => {
			await expect(doTest(["Remote compliment file works!"])).resolves.toBe(true);
		});
	});

	describe("Feature specialDayUnique in compliments module", () => {
		describe("specialDayUnique is false", () => {
			beforeAll(async () => {
				await helpers.startApplication("tests/configs/modules/compliments/compliments_specialDayUnique_false.js");
				await helpers.getDocument();
			});

			it("compliments array can contain all values", async () => {
				await expect(doTest(["Special day message", "Typical message 1", "Typical message 2", "Typical message 3"])).resolves.toBe(true);
			});
		});

		describe("specialDayUnique is true", () => {
			beforeAll(async () => {
				await helpers.startApplication("tests/configs/modules/compliments/compliments_specialDayUnique_true.js");
				await helpers.getDocument();
			});

			it("compliments array contains only special value", async () => {
				await expect(doTest(["Special day message"])).resolves.toBe(true);
			});
		});
	});
});
