import { Popover } from "~/libs/components/components.js";
import { useAppDispatch, useCallback } from "~/libs/hooks/hooks.js";
import { actions as authActions } from "~/modules/auth/auth.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	email: string;
	name: string;
};

const UserPopover = ({ children, email, name }: Properties): JSX.Element => {
	const dispatch = useAppDispatch();

	const handleLogout = useCallback((): void => {
		void dispatch(authActions.logout());
	}, [dispatch]);

	return (
		<Popover
			content={
				<div className={styles["user-popover"]}>
					<div className={styles["user-info"]}>
						<p className={styles["user-name"]}>{name}</p>
						<p className={styles["user-email"]}>{email}</p>
					</div>
					<div className={styles["buttons"]}>
						<button className={styles["button"]}>Profile</button>
						<button className={styles["button"]} onClick={handleLogout}>
							Log out
						</button>
					</div>
				</div>
			}
		>
			{children}
		</Popover>
	);
};

export { UserPopover };