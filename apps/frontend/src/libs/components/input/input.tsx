import {
	type Control,
	type FieldErrors,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";

import { getValidClassNames } from "~/libs/helpers/helpers.js";
import { useFormController } from "~/libs/hooks/hooks.js";

import styles from "./styles.module.css";

type Properties<T extends FieldValues> = {
	autoComplete?: string;
	control: Control<T, null>;
	errors: FieldErrors<T>;
	label: string;
	leftIcon?: JSX.Element;
	name: FieldPath<T>;
	placeholder?: string;
	rightIcon?: JSX.Element;
	rows?: number;
	type?: "email" | "password" | "text";
};

const MIN_ROWS_TO_BE_TEXTAREA = 2;

const Input = <T extends FieldValues>({
	autoComplete,
	control,
	errors,
	label,
	leftIcon,
	name,
	placeholder = "",
	rightIcon,
	rows,
	type = "text",
}: Properties<T>): JSX.Element => {
	const { field } = useFormController({ control, name });

	const error = errors[name]?.message;
	const hasError = Boolean(error);
	const hasLeftIcon = Boolean(leftIcon);
	const hasRightIcon = Boolean(rightIcon);
	const isTextArea = rows && rows >= MIN_ROWS_TO_BE_TEXTAREA;

	return (
		<label className={styles["input-label"]}>
			<span className={styles["input-label-text"]}>{label}</span>
			<div className={styles["input-container"]}>
				{hasLeftIcon && (
					<div
						className={getValidClassNames(
							styles["input-icon"],
							styles["input-icon-left"],
						)}
					>
						{leftIcon}
					</div>
				)}

				{isTextArea ? (
					<textarea
						className={getValidClassNames(
							styles["input-field"],
							styles["input-textarea"],
						)}
						name={field.name}
						onChange={field.onChange}
						placeholder={placeholder}
						style={
							{
								"--rows": rows,
							} as React.CSSProperties
						}
						value={field.value}
					/>
				) : (
					<input
						autoComplete={autoComplete}
						className={styles["input-field"]}
						name={field.name}
						onChange={field.onChange}
						placeholder={placeholder}
						type={type}
						value={field.value}
					/>
				)}

				{hasRightIcon && (
					<div
						className={getValidClassNames(
							styles["input-icon"],
							styles["input-icon-right"],
						)}
					>
						{rightIcon}
					</div>
				)}
			</div>

			{hasError && (
				<span className={styles["input-error"]}>{error as string}</span>
			)}
		</label>
	);
};

export { Input };
