import { ContributorValidationRule } from "./contributor-validation-rule.enum.js";

const ContributorValidationMessage = {
	NAME_REQUIRED: "Contributor name is required.",
	NAME_TOO_LONG: `Name is too long (> ${String(ContributorValidationRule.NAME_MAXIMUM_LENGTH)} symbols).`,
	NAME_TOO_SHORT: `Name must be at least ${String(ContributorValidationRule.NAME_MINIMUM_LENGTH)} characters long.`,
} as const;

export { ContributorValidationMessage };