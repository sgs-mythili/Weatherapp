export function convertTemperature(
  temperature: number,
  unit: "C" | "F"
) {
  if (unit === "C") {
    return Number(temperature.toFixed(2));
  }

  return Number(((temperature * 9) / 5 + 32).toFixed(2));
}