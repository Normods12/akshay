/**
 * timezone.js
 * Converts local birth time (date string + time string + lat/lon) to UTC Date.
 * Uses geo-tz to determine IANA timezone from coordinates.
 * Uses luxon for proper DST-aware conversion.
 */

const { find } = require('geo-tz');
const { DateTime } = require('luxon');

/**
 * Convert local birth datetime to UTC.
 * @param {string} dateOfBirth - "YYYY-MM-DD"
 * @param {string} timeOfBirth - "HH:MM"
 * @param {number} latitude
 * @param {number} longitude
 * @returns {{ utcDate: Date, timezone: string }}
 */
function localToUTC(dateOfBirth, timeOfBirth, latitude, longitude) {
  // Find IANA timezone from coordinates (e.g., "Asia/Kolkata")
  const timezones = find(latitude, longitude);
  if (!timezones || timezones.length === 0) {
    throw new Error(`Could not determine timezone for coordinates (${latitude}, ${longitude})`);
  }
  const timezone = timezones[0];

  // Parse the local datetime in the detected timezone
  const localDateTimeStr = `${dateOfBirth}T${timeOfBirth}:00`;
  const localDt = DateTime.fromISO(localDateTimeStr, { zone: timezone });

  if (!localDt.isValid) {
    throw new Error(`Invalid date or time: ${localDateTimeStr}`);
  }

  // Convert to UTC
  const utcDt = localDt.toUTC();

  return {
    utcDate: utcDt.toJSDate(),
    timezone,
    utcOffset: localDt.offset, // offset in minutes, e.g., 330 for IST
    utcOffsetFormatted: localDt.toFormat('ZZ'), // e.g., "+05:30"
  };
}

module.exports = { localToUTC };
