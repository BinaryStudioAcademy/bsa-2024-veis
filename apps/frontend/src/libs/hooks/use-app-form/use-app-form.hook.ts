import { zodResolver } from "@hookform/resolvers/zod";
import {
	type Control,
	type DefaultValues,
	type FieldErrors,
	type FieldValues,
	useForm,
	type UseFormHandleSubmit,
	type UseFormProps,
	type UseFormSetValue,
	type ValidationMode,
} from "react-hook-form";

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
	handleValueSet: UseFormSetValue<T>;
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
		setValue,
	} = useForm<T>(parameters);

	return {
		control,
		errors,
		handleSubmit,
		handleValueSet: setValue,
		isDirty,
	};
};

export { useAppForm };
