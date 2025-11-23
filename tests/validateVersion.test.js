import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const USERCSS_FILEPATH = path.resolve("./src/DataAnnotationTechDarkMode.user.css");

/**
 * Parses userCSS version and extracts date components
 * @param {string} filePath - Path to the userCSS file
 * @returns {object} Result object with valid flag, version, date components and error message if any
 */
function parseUserCssVersion(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const versionMatch = fileContent.match(/@version\s+(\d+)/);
    if (!versionMatch) {
      return {
        valid: false,
        error: "Missing @version parameter",
      };
    }

    // Extract date components with correct substring indexes
    const version = versionMatch[1];
    const year = parseInt(version.substring(0, 4), 10);
    const month = parseInt(version.substring(4, 6), 10);
    const day = parseInt(version.substring(6, 8), 10);
    const hour = parseInt(version.substring(8, 10), 10);
    const minute = parseInt(version.substring(10, 12), 10);

    return {
      valid: true,
      version,
      components: { year, month, day, hour, minute },
    };
  } catch (error) {
    return {
      valid: false,
      error: `File read error: ${error.message}`,
    };
  }
}

describe("UserCSS Version Validation", () => {
  let result;
  const currentYear = new Date().getFullYear();

  beforeAll(() => {
    expect(fs.existsSync(USERCSS_FILEPATH)).toBe(true, "UserCSS file should exist");
    result = parseUserCssVersion(USERCSS_FILEPATH);
  });

  it("version should be 12 digits", () => {
    expect(result.valid).toBe(true, "Version should be valid");
    expect(result.version).toMatch(/^\d{12}$/, "Version should be 12 digits");
  });

  it("year should be the current year", () => {
    const { year } = result.components;
    expect(year).toBe(currentYear, `Year should be ${currentYear}`);
  });

  it("month should be between 1-12", () => {
    const { month } = result.components;
    expect(month).toBeGreaterThanOrEqual(1, "Month should be at least 1");
    expect(month).toBeLessThanOrEqual(12, "Month should be at most 12");
  });

  it("day should be between 1-31", () => {
    const { day } = result.components;
    expect(day).toBeGreaterThanOrEqual(1, "Day should be at least 1");
    expect(day).toBeLessThanOrEqual(31, "Day should be at most 31");
  });

  it("hour should be between 0-23", () => {
    const { hour } = result.components;
    expect(hour).toBeGreaterThanOrEqual(0, "Hour should be at least 0");
    expect(hour).toBeLessThanOrEqual(23, "Hour should be at most 23");
  });

  it("minute should be between 0-59", () => {
    const { minute } = result.components;
    expect(minute).toBeGreaterThanOrEqual(0, "Minute should be at least 0");
    expect(minute).toBeLessThanOrEqual(59, "Minute should be at most 59");
  });
});
