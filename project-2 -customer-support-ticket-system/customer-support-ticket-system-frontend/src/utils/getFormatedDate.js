//   Formats ISO 8601 timestamps into user-friendly date and time values.
 
//   Responsibility:
//   Keeps date/time formatting logic in one reusable utility instead of
//   handling formatting directly inside UI components.
 
//   Supported formats:
//   - dateOnly:        13 Aug 26
//   - timeOnly:        23:05:04
//  - dateAndTimeOnly: 13/08/2026, 11:05:04 PM
 
export const getFormatedDate = (date, formatValue) => {
  const dateObj = new Date(date);
  switch (formatValue) {
    case "dateOnly":
      return dateObj.toLocaleDateString("en-In", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });

    case "timeOnly":
      return dateObj.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

    case "dateAndTimeOnly":
      return dateObj.toLocaleString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

    default:
      return "";
  }
};
