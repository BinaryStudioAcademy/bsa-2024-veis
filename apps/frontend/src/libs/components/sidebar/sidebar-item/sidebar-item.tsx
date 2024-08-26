import { NavLink } from "react-router-dom";

import { Icon } from "~/libs/components/components.js";
import { type NavigationItem } from "~/libs/types/types.js";

import styles from "./styles.module.css";

const SidebarItem = ({ href, icon, label }: NavigationItem): JSX.Element => (
	<li className={styles["sidebar-item"]}>
		<NavLink className={styles["navigation-link"] ?? ""} to={href}>
			<span className={styles["navigation-icon"]}>
				<Icon height={20} name={icon} width={20} />
			</span>
			<label className={styles["navigation-item-label"]}>{label}</label>
		</NavLink>
	</li>
);

export { SidebarItem };
