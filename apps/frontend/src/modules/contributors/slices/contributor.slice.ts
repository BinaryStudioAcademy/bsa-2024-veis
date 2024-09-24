import { createSlice, isAnyOf } from "@reduxjs/toolkit";

import { ITEMS_CHANGED_COUNT } from "~/libs/constants/constants.js";
import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type ContributorGetAllItemResponseDto } from "../libs/types/types.js";
import { loadAll, loadAllByProjectId, merge, patch, split } from "./actions.js";

type State = {
	contributors: ContributorGetAllItemResponseDto[];
	dataStatus: ValueOf<typeof DataStatus>;
	mergeContributorsStatus: ValueOf<typeof DataStatus>;
	splitContributorsStatus: ValueOf<typeof DataStatus>;
	totalCount: number;
	updateContributorsStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	contributors: [],
	dataStatus: DataStatus.IDLE,
	mergeContributorsStatus: DataStatus.IDLE,
	splitContributorsStatus: DataStatus.IDLE,
	totalCount: 0,
	updateContributorsStatus: DataStatus.IDLE,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(merge.pending, (state) => {
			state.mergeContributorsStatus = DataStatus.PENDING;
		});
		builder.addCase(merge.fulfilled, (state, action) => {
			const { gitEmails: updatedGitEmails, id } = action.payload;

			const isSameContributor = (contributorId: number): boolean =>
				contributorId === id;

			const hasMatchingGitEmail = (
				contributorEmails: { email: string }[],
			): boolean =>
				contributorEmails.some((email) =>
					updatedGitEmails.some(
						(updatedEmail) => updatedEmail.email === email.email,
					),
				);

			const removedContributorId = state.contributors.find(
				(contributor) =>
					!isSameContributor(contributor.id) &&
					hasMatchingGitEmail(contributor.gitEmails),
			)?.id;

			if (removedContributorId) {
				state.contributors = state.contributors.filter(
					(contributor) => contributor.id !== removedContributorId,
				);
				state.totalCount -= ITEMS_CHANGED_COUNT;
			}

			state.contributors = state.contributors.map((contributor) =>
				isSameContributor(contributor.id)
					? { ...contributor, ...action.payload }
					: contributor,
			);
			state.mergeContributorsStatus = DataStatus.FULFILLED;
		});
		builder.addCase(merge.rejected, (state) => {
			state.mergeContributorsStatus = DataStatus.REJECTED;
		});

		builder.addCase(patch.pending, (state) => {
			state.updateContributorsStatus = DataStatus.PENDING;
		});
		builder.addCase(patch.fulfilled, (state, action) => {
			state.contributors = state.contributors.map((contributor) =>
				contributor.id === action.payload.id
					? { ...contributor, ...action.payload }
					: contributor,
			);
			state.updateContributorsStatus = DataStatus.FULFILLED;
		});
		builder.addCase(patch.rejected, (state) => {
			state.updateContributorsStatus = DataStatus.REJECTED;
		});

		builder.addCase(split.pending, (state) => {
			state.splitContributorsStatus = DataStatus.PENDING;
		});
		builder.addCase(split.fulfilled, (state, action) => {
			const { id: splittingContributorId } = action.meta.arg;
			const { payload: newContributor } = action;

			state.contributors = state.contributors.map((contributor) => {
				if (contributor.id !== splittingContributorId) {
					return contributor;
				}

				const [splitEmail] = newContributor.gitEmails;

				return {
					...contributor,
					gitEmails: contributor.gitEmails.filter(
						({ id }) => id !== splitEmail?.id,
					),
				};
			});

			state.contributors = [newContributor, ...state.contributors];

			state.splitContributorsStatus = DataStatus.FULFILLED;
		});
		builder.addCase(split.rejected, (state) => {
			state.splitContributorsStatus = DataStatus.REJECTED;
		});

		builder.addMatcher(
			isAnyOf(loadAll.pending, loadAllByProjectId.pending),
			(state) => {
				state.dataStatus = DataStatus.PENDING;
			},
		);
		builder.addMatcher(
			isAnyOf(loadAll.fulfilled, loadAllByProjectId.fulfilled),
			(state, action) => {
				state.contributors = action.payload.items;
				state.dataStatus = DataStatus.FULFILLED;
				state.totalCount = action.payload.totalItems;
			},
		);
		builder.addMatcher(
			isAnyOf(loadAll.rejected, loadAllByProjectId.rejected),
			(state) => {
				state.contributors = [];
				state.dataStatus = DataStatus.REJECTED;
			},
		);
	},
	initialState,
	name: "contributors",
	reducers: {},
});

export { actions, name, reducer };
