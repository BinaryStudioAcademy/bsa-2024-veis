import { Modal, Table, TablePagination } from "~/libs/components/components.js";
import {
	useAppDispatch,
	useCallback,
	useModal,
	useState,
} from "~/libs/hooks/hooks.js";
import {
	actions as groupActions,
	type GroupGetAllItemResponseDto,
	type GroupUpdateRequestDto,
} from "~/modules/groups/groups.js";

import { getGroupColumns, getGroupRows } from "../../helpers/helpers.js";
import { type GroupRow } from "../../types/types.js";
import { GroupsUpdateForm } from "../groups-update-form/groups-update-form.js";

type Properties = {
	groups: GroupGetAllItemResponseDto[];
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	page: number;
	pageSize: number;
	totalItemsCount: number;
};

const GroupsTable = ({
	groups,
	onPageChange,
	onPageSizeChange,
	page,
	pageSize,
	totalItemsCount,
}: Properties): JSX.Element => {
	const dispatch = useAppDispatch();

	const { isOpened, onClose, onOpen } = useModal();
	const [groupToEdit, setGroupToEdit] =
		useState<GroupGetAllItemResponseDto | null>(null);

	const handleModalClose = useCallback(() => {
		setGroupToEdit(null);
		onClose();
	}, [onClose, setGroupToEdit]);

	const handleUpdate = useCallback(
		(id: number, payload: GroupUpdateRequestDto) => {
			void dispatch(groupActions.update({ id, payload }));
			handleModalClose();
		},
		[dispatch, handleModalClose],
	);

	const groupColumns = getGroupColumns({
		onEdit: (groupId: number) => {
			const group = groups.find(({ id }) => id === groupId);
			setGroupToEdit(group ?? null);

			onOpen();
		},
	});
	const groupData: GroupRow[] = getGroupRows(groups);

	return (
		<>
			<Table<GroupRow> columns={groupColumns} data={groupData} />
			<TablePagination
				onPageChange={onPageChange}
				onPageSizeChange={onPageSizeChange}
				page={page}
				pageSize={pageSize}
				totalItemsCount={totalItemsCount}
			/>

			{groupToEdit && (
				<Modal
					isOpened={isOpened}
					onClose={handleModalClose}
					title="Update group"
				>
					<GroupsUpdateForm group={groupToEdit} onSubmit={handleUpdate} />
				</Modal>
			)}
		</>
	);
};

export { GroupsTable };
