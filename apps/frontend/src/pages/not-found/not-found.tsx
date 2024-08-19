import { Button } from "~/libs/components/components.js";

import styles from "./styles.module.css";

const NotFound = (): JSX.Element => {
	return (
		<main className={styles["container"]}>
			<span className={styles["decoration"]}>404</span>
			<h1 className={styles["title"]}>Something went wrong</h1>
			<p className={styles["text"]}>
				Sorry, we can’t find the page you’re looking for.
			</p>
			<Button href="/" label="Back to home" />
		</main>
	);
};

export { NotFound };
