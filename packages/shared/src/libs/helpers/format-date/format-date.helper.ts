import { format } from "date-fns";

type DateFormat = "d MMM yyyy HH:mm";

const formatDate = (date: Date, dateFormat: DateFormat): string => {
	return format(date, dateFormat);
};

export { formatDate };
