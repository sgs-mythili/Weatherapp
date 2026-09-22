export function convertTemperature(
  temperature: number,
  unit: "C" | "F"
) {
  if (unit === "C") {
    return temperature;
  }

  return (temperature * 9) / 5 + 32;
}