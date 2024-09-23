import logoSrc from "~/assets/images/logo.svg";
import { Avatar, Icon, NavLink } from "~/libs/components/components.js";
import { EMPTY_LENGTH } from "~/libs/constants/constants.js";
import { AppRoute } from "~/libs/enums/enums.js";
import { getValidClassNames } from "~/libs/helpers/helpers.js";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	usePopover,
} from "~/libs/hooks/hooks.js";
import { actions as notificationActions } from "~/modules/notifications/notifications.js";

import {
	NotificationsPopover,
	UserPopover,
} from "./libs/components/components.js";
import styles from "./styles.module.css";

const Header = (): JSX.Element => {
	const dispatch = useAppDispatch();

	const {
		isOpened: isUserOpened,
		onClose: onUserClose,
		onOpen: onUserOpen,
	} = usePopover();

	const {
		isOpened: isNotificationsOpened,
		onClose: onNotificationsClose,
		onOpen: onNotificationsOpen,
	} = usePopover();

	const authenticatedUser = useAppSelector(
		({ auth }) => auth.authenticatedUser,
	);

	const { notifications } = useAppSelector(
		({ notifications }) => notifications,
	);

	useEffect(() => {
		void dispatch(notificationActions.loadAll());
	}, [dispatch]);

	const unreadNotifications = notifications.filter((n) => !n.isRead);
	const hasUnreadNotifications = unreadNotifications.length !== EMPTY_LENGTH;

	const markAllNotificationsAsRead = useCallback(() => {
		for (const notification of unreadNotifications) {
			void dispatch(notificationActions.markAsRead({ id: notification.id }));
		}
	}, [dispatch, unreadNotifications]);

	const handleNotificationsClose = useCallback(() => {
		markAllNotificationsAsRead();
		onNotificationsClose();
	}, [markAllNotificationsAsRead, onNotificationsClose]);

	if (!authenticatedUser) {
		return <></>;
	}

	const { email, name } = authenticatedUser;

	return (
		<header className={styles["header"]}>
			<NavLink className={styles["logo-link"] as string} to={AppRoute.ROOT}>
				<img alt="GitFit logo" className={styles["logo-img"]} src={logoSrc} />
			</NavLink>
			<div className={styles["header-popovers"]}>
				<NotificationsPopover
					isOpened={isNotificationsOpened}
					notifications={notifications}
					onClose={handleNotificationsClose}
				>
					<button
						className={getValidClassNames(
							styles["notifications-popover-trigger"],
							isNotificationsOpened &&
								styles["notifications-popover-trigger-opened"],
						)}
						onClick={
							isNotificationsOpened ? onNotificationsClose : onNotificationsOpen
						}
					>
						<div className={styles["notifications-icon-wrapper"]}>
							<Icon height={22} name="notifications" width={22} />
							{hasUnreadNotifications && (
								<span className={styles["notifications-badge-count"]}>
									{unreadNotifications.length}
								</span>
							)}
						</div>
					</button>
				</NotificationsPopover>
				<UserPopover
					email={email}
					isOpened={isUserOpened}
					name={name}
					onClose={onUserClose}
				>
					<button
						className={styles["user-popover-trigger"]}
						onClick={isUserOpened ? onUserClose : onUserOpen}
					>
						<Avatar name={name} />
					</button>
				</UserPopover>
			</div>
		</header>
	);
};

export { Header };
