import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

export function formatDisplayDate(dateKey: string) {
  return format(parseISO(dateKey), "EEEE, d MMM yyyy", { locale: localeId });
}

export function formatShortDate(dateKey: string) {
  return format(parseISO(dateKey), "d MMM yyyy", { locale: localeId });
}
