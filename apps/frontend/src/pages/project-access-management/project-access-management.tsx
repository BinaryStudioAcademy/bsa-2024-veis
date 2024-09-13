import {
	Breadcrumbs,
	Button,
	Modal,
	PageLayout,
} from "~/libs/components/components.js";
import { AppRoute, DataStatus } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useModal,
	usePagination,
	useParams,
} from "~/libs/hooks/hooks.js";
import { type ValueOf } from "~/libs/types/types.js";
import { type ProjectGroupCreateRequestDto } from "~/modules/project-groups/project-groups.js";
import { actions as projectGroupActions } from "~/modules/project-groups/project-groups.js";
import { actions as projectActions } from "~/modules/projects/projects.js";
import { NotFound } from "~/pages/not-found/not-found.jsx";

import { ProjectGroupCreateForm } from "./libs/components/components.js";
import { getUsersFromProjectGroups } from "./libs/components/project-group-create-form/libs/helpers/helpers.js";
import { ProjectGroupsTable } from "./libs/components/project-groups-table/project-groups-table.js";
import { UsersTable } from "./libs/components/users-table/users-table.js";
import styles from "./styles.module.css";

const ProjectAccessManagement = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const { id } = useParams<{ id: string }>();

	const { project, projectStatus: projectDataStatus } = useAppSelector(
		({ projects }) => projects,
	);

	const {
		dataStatus: projectGroupsDataStatus,
		projectGroupCreateStatus,
		projectGroups,
		projectGroupsTotalCount,
	} = useAppSelector(({ projectGroups }) => projectGroups);

	const hasProject = project !== null;
	const projectRoute = hasProject
		? configureString(AppRoute.PROJECT, {
				id: project.id.toString(),
			})
		: "";

	const users = getUsersFromProjectGroups(projectGroups);
	const usersTotalCount = users.length;

	const {
		onPageChange: onUserPageChange,
		onPageSizeChange: onUserPageSizeChange,
		page: userPage,
		pageSize: userPageSize,
	} = usePagination({
		queryParameterPrefix: "project-user",
		totalItemsCount: usersTotalCount,
	});

	const {
		onPageChange: onGroupPageChange,
		onPageSizeChange: onGroupPageSizeChange,
		page: groupPage,
		pageSize: groupPageSize,
	} = usePagination({
		queryParameterPrefix: "project-group",
		totalItemsCount: projectGroupsTotalCount,
	});

	const {
		isOpened: isCreateModalOpened,
		onClose: onCreateModalClose,
		onOpen: onCreateModalOpen,
	} = useModal();

	useEffect(() => {
		if (id) {
			void dispatch(projectActions.getById({ id }));
		}
	}, [dispatch, id]);

	const handleLoadGroups = useCallback(() => {
		if (id) {
			void dispatch(
				projectGroupActions.loadAllByProjectId({
					projectId: id,
					query: { page: groupPage, pageSize: groupPageSize },
				}),
			);
		}
	}, [dispatch, groupPage, groupPageSize, id]);

	useEffect(() => {
		handleLoadGroups();
	}, [handleLoadGroups]);

	const handleProjectGroupCreateSubmit = useCallback(
		(payload: ProjectGroupCreateRequestDto) => {
			void dispatch(projectGroupActions.create(payload));
		},
		[dispatch],
	);

	useEffect(() => {
		if (projectGroupCreateStatus === DataStatus.FULFILLED) {
			onCreateModalClose();
		}
	}, [projectGroupCreateStatus, onCreateModalClose]);

	const isProjectLoading =
		projectDataStatus === DataStatus.IDLE ||
		projectDataStatus === DataStatus.PENDING;

	const isProjectGroupsLoading =
		projectGroupsDataStatus === DataStatus.IDLE ||
		projectGroupsDataStatus === DataStatus.PENDING;

	const isLoading = isProjectLoading || isProjectGroupsLoading;

	const isRejected = projectDataStatus === DataStatus.REJECTED;

	if (isRejected) {
		return <NotFound />;
	}

	return (
		<PageLayout isLoading={isLoading}>
			{hasProject && (
				<>
					<div className={styles["breadcrumb-container"]}>
						<Breadcrumbs
							items={[
								{ href: AppRoute.ROOT, label: "Projects" },
								{
									href: projectRoute as ValueOf<typeof AppRoute>,
									label: project.name,
								},
								{ label: "Access Management" },
							]}
						/>
					</div>
					<h1 className={styles["title"]}>Access Management</h1>
					<section>
						<div className={styles["section-header"]}>
							<h2 className={styles["section-title"]}>Users</h2>
						</div>
						<UsersTable
							onPageChange={onUserPageChange}
							onPageSizeChange={onUserPageSizeChange}
							page={userPage}
							pageSize={userPageSize}
							totalItemsCount={usersTotalCount}
							users={users}
						/>
					</section>
					<section>
						<div className={styles["section-header"]}>
							<h2 className={styles["section-title"]}>Groups</h2>
							<div>
								<Button label="Create New" onClick={onCreateModalOpen} />
							</div>
						</div>
						<ProjectGroupsTable
							onPageChange={onGroupPageChange}
							onPageSizeChange={onGroupPageSizeChange}
							page={groupPage}
							pageSize={groupPageSize}
							projectGroups={projectGroups}
							totalItemsCount={projectGroupsTotalCount}
						/>
					</section>
					<Modal
						isOpened={isCreateModalOpened}
						onClose={onCreateModalClose}
						title="Create new group"
					>
						<ProjectGroupCreateForm
							onSubmit={handleProjectGroupCreateSubmit}
							projectGroups={projectGroups}
							projectId={project.id}
						/>
					</Modal>
				</>
			)}
		</PageLayout>
	);
};

export { ProjectAccessManagement };
