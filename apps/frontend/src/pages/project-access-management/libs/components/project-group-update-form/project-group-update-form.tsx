import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	usePagination,
} from "~/libs/hooks/hooks.js";
import {
	type ProjectGroupGetAllItemResponseDto,
	type ProjectGroupPatchRequestDto,
	projectGroupPatchValidationSchema,
	actions as projectGroupsActions,
} from "~/modules/project-groups/project-groups.js";

import { filterUserProjectGroups } from "../../helpers/helpers.js";
import { ProjectGroupForm } from "../project-group-form/project-group-form.js";

type Properties = {
	onSubmit: (id: number, payload: ProjectGroupPatchRequestDto) => void;
	projectGroup: ProjectGroupGetAllItemResponseDto;
	projectGroups: ProjectGroupGetAllItemResponseDto[];
};

const ProjectGroupUpdateForm = ({
	onSubmit,
	projectGroup,
	projectGroups,
}: Properties): JSX.Element => {
	const dispatch = useAppDispatch();
	const { id, name, permissions, users: projectGroupUsers } = projectGroup;

	const permissionIds = permissions.map((permission) => permission.id);
	const userIds = projectGroupUsers.map((user) => user.id);

	const { users, usersTotalCount } = useAppSelector(({ projectGroups }) => ({
		projectGroups,
		users: projectGroups.users,
		usersTotalCount: projectGroups.usersTotalCount,
	}));

	const usersWithCurrentProjectGroups = filterUserProjectGroups(
		users,
		projectGroups,
	);

	const { page: userPage, pageSize: userPageSize } = usePagination({
		queryParameterPrefix: "project-group-user",
		totalItemsCount: usersTotalCount,
	});

	useEffect(() => {
		void dispatch(
			projectGroupsActions.loadUsers({
				page: userPage,
				pageSize: userPageSize,
			}),
		);
	}, [dispatch, userPage, userPageSize]);

	const handleFormSubmit = useCallback(
		(formData: ProjectGroupPatchRequestDto): void => {
			onSubmit(id, formData);
		},
		[id, onSubmit],
	);

	return (
		<ProjectGroupForm
			defaultValues={{
				name,
				permissionIds,
				userIds,
			}}
			onSubmit={handleFormSubmit}
			submitLabel="Submit"
			users={usersWithCurrentProjectGroups}
			validationSchema={projectGroupPatchValidationSchema}
		/>
	);
};

export { ProjectGroupUpdateForm };