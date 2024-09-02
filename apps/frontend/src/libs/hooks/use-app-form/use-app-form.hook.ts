import { zodResolver } from "@hookform/resolvers/zod";
import {
	type Control,
	type DefaultValues,
	type FieldErrors,
	type FieldValues,
	type UseFormHandleSubmit,
	type UseFormProps,
	type ValidationMode,
} from "react-hook-form";
import { useForm } from "react-hook-form";

import { type ValidationSchema } from "~/libs/types/types.js";

type Parameters<T extends FieldValues = FieldValues> = {
	defaultValues: DefaultValues<T>;
	mode?: keyof ValidationMode;
	validationSchema?: ValidationSchema;
};

type ReturnValue<T extends FieldValues = FieldValues> = {
	control: Control<T, null>;
	errors: FieldErrors<T>;
	handleSubmit: UseFormHandleSubmit<T>;
	isDirty: boolean;
};

const useAppForm = <T extends FieldValues = FieldValues>({
	defaultValues,
	mode = "onSubmit",
	validationSchema,
}: Parameters<T>): ReturnValue<T> => {
	const parameters: UseFormProps<T> = {
		defaultValues,
		mode,
	};

	if (validationSchema) {
		parameters.resolver = zodResolver(validationSchema);
	}

	const {
		control,
		formState: { errors, isDirty },
		handleSubmit,
	} = useForm<T>(parameters);

	return {
		control,
		errors,
		handleSubmit,
		isDirty,
	};
};

export { useAppForm };
