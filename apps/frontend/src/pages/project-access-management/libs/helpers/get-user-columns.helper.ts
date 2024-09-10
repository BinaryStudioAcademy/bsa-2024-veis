import { formatDate } from "~/libs/helpers/helpers.js";
import { type TableColumn } from "~/libs/types/types.js";

import { type UserRow } from "../types/types.js";

const getUserColumns = (): TableColumn<UserRow>[] => {
	return [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "groups",
			header: "Groups",
		},
		{
			accessorFn: (user: UserRow): string =>
				formatDate(new Date(user.createdAt), "d MMM yyyy HH:mm"),
			header: "Created At",
		},
	];
};

export { getUserColumns };