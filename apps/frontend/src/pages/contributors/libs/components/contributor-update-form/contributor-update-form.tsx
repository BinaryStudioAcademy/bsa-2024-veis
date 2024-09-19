import { Button, Checkbox, Input } from "~/libs/components/components.js";
import { useAppForm, useCallback } from "~/libs/hooks/hooks.js";
import {
	type ContributorGetAllItemResponseDto,
	type ContributorPatchRequestDto,
	ContributorPatchValidationSchema,
} from "~/modules/contributors/contributors.js";

import styles from "./styles.module.css";

type Properties = {
	contributor: ContributorGetAllItemResponseDto;
	onSubmit: (payload: ContributorPatchRequestDto) => void;
};

const ContributorUpdateForm = ({
	contributor,
	onSubmit,
}: Properties): JSX.Element => {
	const { gitEmails, isHidden, name, projects } = contributor;

	const gitEmailsString = gitEmails.map((email) => email.email).join(", ");
	const projectsString = projects.map((project) => project.name).join(", ");

	const { control, errors, handleSubmit } = useAppForm<{
		gitEmails: string;
		isHidden: boolean;
		name: string;
		projects: string;
	}>({
		defaultValues: {
			gitEmails: gitEmailsString,
			isHidden,
			name,
			projects: projectsString,
		},
		validationSchema: ContributorPatchValidationSchema,
	});

	const handleFormSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit((formData: { isHidden: boolean; name: string }) => {
				const payload: ContributorPatchRequestDto = {
					isHidden: formData.isHidden,
					name: formData.name,
				};
				onSubmit(payload);
			})(event_);
		},
		[handleSubmit, onSubmit],
	);

	return (
		<form className={styles["form-wrapper"]} onSubmit={handleFormSubmit}>
			<Input
				autoComplete="name"
				control={control}
				errors={errors}
				label="Name"
				name="name"
			/>
			<Input
				control={control}
				errors={errors}
				isDisabled
				label="Git Emails"
				name="gitEmails"
			/>
			<Input
				control={control}
				errors={errors}
				isDisabled
				label="Project"
				name="projects"
			/>
			<div className={styles["checkbox-wrapper"]}>
				<label className={styles["checkbox-label"]} htmlFor="isHidden">
					<Checkbox
						control={control}
						errors={errors}
						id="isHidden"
						name="isHidden"
					/>
					<span>Is hidden</span>
				</label>
				<p className={styles["checkbox-description"]}>
					If this option is checked, the contributor will be hidden from the
					analytics and projects list.
				</p>
			</div>
			<div className={styles["button-wrapper"]}>
				<Button label="Update" type="submit" />
			</div>
		</form>
	);
};

export { ContributorUpdateForm };
