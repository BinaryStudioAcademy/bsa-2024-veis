import {
	Button,
	ConfirmationModal,
	Loader,
	Modal,
	PageLayout,
} from "~/libs/components/components.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useIntersectionObserver,
	useModal,
	useSearch,
	useState,
} from "~/libs/hooks/hooks.js";
import {
	DEFAULT_START,
	INFINITE_SCROLL_LOAD_COUNT,
	actions as projectActions,
	type ProjectCreateRequestDto,
	type ProjectGetAllItemResponseDto,
	type ProjectPatchRequestDto,
} from "~/modules/projects/projects.js";

import {
	ProjectCard,
	ProjectCreateForm,
	ProjectsSearch,
	ProjectUpdateForm,
} from "./libs/components/components.js";
import styles from "./styles.module.css";

const Projects = (): JSX.Element => {
	const dispatch = useAppDispatch();

	const { onSearch, search } = useSearch();

	const [selectedProject, setSelectedProject] =
		useState<null | ProjectGetAllItemResponseDto>(null);

	const [start, setStart] = useState<number>(DEFAULT_START);

	const {
		dataStatus,
		hasMoreProjects,
		projectCreateStatus,
		projectPatchStatus,
		projects,
	} = useAppSelector(({ projects }) => projects);

	const loadMoreProjects = useCallback(() => {
		if (dataStatus !== DataStatus.PENDING) {
			void dispatch(
				projectActions.loadMore({
					limit: INFINITE_SCROLL_LOAD_COUNT,
					name: search,
					start: start + INFINITE_SCROLL_LOAD_COUNT,
				}),
			);

			setStart((previousStart) => previousStart + INFINITE_SCROLL_LOAD_COUNT);
		}
	}, [dispatch, search, start, dataStatus]);

	const sentinelReference = useIntersectionObserver<HTMLDivElement>({
		isEnabled: hasMoreProjects && dataStatus !== DataStatus.PENDING,
		onIntersect: loadMoreProjects,
	});

	useEffect(() => {
		void dispatch(projectActions.loadAll(search));
		setStart(DEFAULT_START);
	}, [dispatch, search]);

	const handleSearchChange = useCallback(
		(value: string) => {
			void dispatch(projectActions.loadAll(value));
			onSearch(value);
			setStart(DEFAULT_START);
		},
		[dispatch, onSearch],
	);

	const hasProject = projects.length !== EMPTY_LENGTH;

	const {
		isOpened: isCreateModalOpen,
		onClose: handleCreateModalClose,
		onOpen: handleCreateModalOpen,
	} = useModal();
	const {
		isOpened: isEditModalOpen,
		onClose: handleEditModalClose,
		onOpen: handleEditModalOpen,
	} = useModal();
	const {
		isOpened: isDeleteConfirmationModalOpen,
		onClose: handleDeleteConfirmationModalClose,
		onOpen: handleDeleteConfirmationModalOpen,
	} = useModal();

	useEffect(() => {
		if (projectCreateStatus === DataStatus.FULFILLED) {
			handleCreateModalClose();
		}
	}, [projectCreateStatus, handleCreateModalClose]);

	useEffect(() => {
		if (projectPatchStatus === DataStatus.FULFILLED) {
			handleEditModalClose();
		}
	}, [projectPatchStatus, handleEditModalClose]);

	const handleEditClick = useCallback(
		(project: ProjectGetAllItemResponseDto) => {
			setSelectedProject(project);
			handleEditModalOpen();
		},
		[handleEditModalOpen],
	);

	const handleDeleteClick = useCallback(
		(project: ProjectGetAllItemResponseDto) => {
			setSelectedProject(project);
			handleDeleteConfirmationModalOpen();
		},
		[handleDeleteConfirmationModalOpen],
	);
	const handleProjectCreateSubmit = useCallback(
		(payload: ProjectCreateRequestDto) => {
			void dispatch(projectActions.create(payload));
		},
		[dispatch],
	);

	const handleProjectEditSubmit = useCallback(
		(payload: ProjectPatchRequestDto) => {
			if (selectedProject) {
				void dispatch(
					projectActions.patch({ id: selectedProject.id, payload }),
				);
			}
		},
		[dispatch, selectedProject],
	);

	const handleProjectDeleteConfirm = useCallback(() => {
		if (selectedProject) {
			void dispatch(projectActions.deleteById(selectedProject.id));
			handleDeleteConfirmationModalClose();
		}
	}, [dispatch, selectedProject, handleDeleteConfirmationModalClose]);

	const isLoading =
		dataStatus === DataStatus.IDLE ||
		(dataStatus === DataStatus.PENDING && !hasProject);

	const isLoadingMore = hasMoreProjects && dataStatus === DataStatus.PENDING;

	return (
		<PageLayout>
			<header className={styles["projects-header"]}>
				<h1 className={styles["title"]}>Projects</h1>
				<Button label="Create New" onClick={handleCreateModalOpen} />
			</header>
			<ProjectsSearch onChange={handleSearchChange} />
			{isLoading ? (
				<Loader />
			) : (
				<div className={styles["projects-list"]}>
					{hasProject ? (
						projects.map((project) => (
							<ProjectCard
								key={project.id}
								onDelete={handleDeleteClick}
								onEdit={handleEditClick}
								project={project}
							/>
						))
					) : (
						<p className={styles["empty-placeholder"]}>
							No projects found matching your search criteria. Please try
							different keywords.
						</p>
					)}

					<div ref={sentinelReference} />
					{isLoadingMore && <Loader />}
				</div>
			)}
			<Modal
				isOpened={isCreateModalOpen}
				onClose={handleCreateModalClose}
				title="Create new project"
			>
				<ProjectCreateForm onSubmit={handleProjectCreateSubmit} />
			</Modal>
			<Modal
				isOpened={isEditModalOpen}
				onClose={handleEditModalClose}
				title="Update project"
			>
				{selectedProject && (
					<ProjectUpdateForm
						onSubmit={handleProjectEditSubmit}
						project={selectedProject}
					/>
				)}
			</Modal>
			<ConfirmationModal
				content="The project will be deleted. This action cannot be undone. Click 'Confirm' to proceed."
				isOpened={isDeleteConfirmationModalOpen}
				onClose={handleDeleteConfirmationModalClose}
				onConfirm={handleProjectDeleteConfirm}
			/>
		</PageLayout>
	);
};

export { Projects };
