export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date | string, locale: "en" | "bn" = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "bn" ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
