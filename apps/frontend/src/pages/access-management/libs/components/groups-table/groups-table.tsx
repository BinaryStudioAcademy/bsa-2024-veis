import { Table, TablePagination } from "~/libs/components/components.js";
import { type GroupGetAllItemResponseDto } from "~/modules/groups/groups.js";

import { getGroupColumns, getGroupRows } from "../../helpers/helpers.js";
import { type GroupRow } from "../../types/types.js";
import styles from "./styles.module.css";

type Properties = {
	groups: GroupGetAllItemResponseDto[];
	onEdit: (group: GroupGetAllItemResponseDto) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	page: number;
	pageSize: number;
	paginationBackground?: "primary" | "secondary";
	totalItemsCount: number;
};

const GroupsTable = ({
	groups,
	onEdit,
	onPageChange,
	onPageSizeChange,
	page,
	pageSize,
	paginationBackground = "primary",
	totalItemsCount,
}: Properties): JSX.Element => {
	const groupColumns = getGroupColumns({
		onDelete: () => {},
		onEdit: (groupId: number) => {
			const group = groups.find(({ id }) => id === groupId);
			onEdit(group as GroupGetAllItemResponseDto);
		},
	});
	const groupData: GroupRow[] = getGroupRows(groups);

	return (
		<div className={styles["groups-table"]}>
			<Table<GroupRow> columns={groupColumns} data={groupData} />
			<TablePagination
				background={paginationBackground}
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
				page={page}
				pageSize={pageSize}
				totalItemsCount={totalItemsCount}
			/>
		</div>
	);
};

export { GroupsTable };
