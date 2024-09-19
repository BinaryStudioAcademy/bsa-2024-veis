import { Header, Loader, Sidebar } from "~/libs/components/components.js";
import { SIDEBAR_ITEMS } from "~/libs/constants/constants.js";
import { useAppSelector } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	isLoading?: boolean;
};

const PageLayout = ({
	children,
	isLoading = false,
}: Properties): JSX.Element => {
	const { authenticatedUser } = useAppSelector(({ auth }) => auth);

	const mainPermission = authenticatedUser
		? authenticatedUser.groups.flatMap((group) => group.permissions)
		: [];

	const projectPermission = authenticatedUser
		? authenticatedUser.projectGroups.flatMap(
				(projectGroup) => projectGroup.permissions,
			)
		: [];
	const userPermissions = [...projectPermission, ...mainPermission];

	return (
		<div className={styles["page"]}>
			<div className={styles["page-header"]}>
				<Header />
			</div>
			<div className={styles["page-body"]}>
				<aside className={styles["page-sidebar"]}>
					<Sidebar items={SIDEBAR_ITEMS} userPermissions={userPermissions} />
				</aside>
				<main className={styles["page-content"]}>
					{isLoading ? <Loader /> : <>{children}</>}
				</main>
			</div>
		</div>
	);
};

export { PageLayout };
