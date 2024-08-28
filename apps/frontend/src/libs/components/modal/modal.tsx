import { IconButton } from "~/libs/components/components.js";
import { useHandleClickOutside, useRef } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type Properties = {
	children: React.ReactNode;
	isModalOpened: boolean;
	onModalClose: () => void;
	title: string;
};

const Modal = ({
	children,
	isModalOpened,
	onModalClose,
	title,
}: Properties): JSX.Element | null => {
	const dialogReference = useRef<HTMLDialogElement>(null);

	useHandleClickOutside(dialogReference, onModalClose);

	if (!isModalOpened) {
		return null;
	}

	return (
		<>
			<div className={styles["modal-backdrop"]} />

			<dialog
				aria-label={title}
				className={styles["modal-container"]}
				ref={dialogReference}
			>
				<div className={styles["modal-content"]}>
					<div className={styles["modal-header-title"]}>
						<h3>{title}</h3>
						<div className={styles["modal-close"]}>
							<IconButton
								iconHeight={20}
								iconName="cross"
								iconWidth={20}
								label="Close"
								onClick={onModalClose}
							/>
						</div>
					</div>
					<div className={styles["modal-body"]}>{children}</div>
				</div>
			</dialog>
		</>
	);
};

export { Modal };