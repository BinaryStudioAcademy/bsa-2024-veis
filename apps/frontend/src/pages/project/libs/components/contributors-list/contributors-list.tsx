import { type ContributorGetAllItemResponseDto } from "~/pages/project/libs/types/types.js";

import { ContributorCard } from "../components.js";
import styles from "./styles.module.css";

type Properties = {
	contributors: ContributorGetAllItemResponseDto[];
};

const ContributorsList = ({ contributors }: Properties): JSX.Element => {
	return (
		<div className={styles["container"]}>
			<h2 className={styles["title"]}>Contributors</h2>
			<ul className={styles["list"]}>
				{contributors.map((contributor) => (
					<li key={contributor.id}>
						<ContributorCard contributor={contributor} />
					</li>
				))}
			</ul>
		</div>
	);
};

export { ContributorsList };
