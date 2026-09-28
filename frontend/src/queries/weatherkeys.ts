export const weatherKeys = {
  all: ["weather"] as const,

  city: (city: string) =>
    [...weatherKeys.all, city] as const,
};