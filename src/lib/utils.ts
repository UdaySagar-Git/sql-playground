export const generateId = () => {
  return crypto.randomUUID();
};
export const formatDate = (date: Date | string): string => {
  const dateObject = date instanceof Date ? date : new Date(date);

  return dateObject.toLocaleString("en-US", {
    hour12: true,
    year: "numeric", 
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
