export function msToLaptime(msIn: number | undefined) {
  if (msIn === undefined) {
    return "";
  }

  const ms = Math.abs(msIn);

  if (ms < 1000) {
    return (
      (msIn < 0 ? "-" : "") +
      `00:${Math.round(ms / 10)
        .toString()
        .padStart(2, "0")}`
    );
  }

  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const thousands = ms % 1000;

  if (isNaN(ms) || isNaN(mins) || isNaN(secs) || isNaN(thousands)) {
    return "";
  }

  return (
    (msIn < 0 ? "-" : "") +
    `${mins ? mins + ":" : ""}${secs
      .toString()
      .padStart(mins > 0 ? 2 : 0, "0")}:${Math.floor(thousands / 10)
      .toString()
      .padStart(2, "0")}`
  );
}
