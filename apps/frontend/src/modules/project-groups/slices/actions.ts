import { createAsyncThunk } from "@reduxjs/toolkit";

import { NotificationMessage } from "~/libs/enums/enums.js";
import {
	type AsyncThunkConfig,
	type PaginationQueryParameters,
} from "~/libs/types/types.js";
import { type UserGetAllResponseDto } from "~/modules/users/users.js";

import {
	type ProjectGroupCreateRequestDto,
	type ProjectGroupGetAllItemResponseDto,
	type ProjectGroupGetAllResponseDto,
} from "../libs/types/types.js";
import { name as sliceName } from "./project-group.slice.js";

const loadUsers = createAsyncThunk<
	UserGetAllResponseDto,
	PaginationQueryParameters,
	AsyncThunkConfig
>(`${sliceName}/load-users`, (query, { extra }) => {
	const { userApi } = extra;

	return userApi.getAll(query);
});

const loadAllByProjectId = createAsyncThunk<
	ProjectGroupGetAllResponseDto,
	{ projectId: string; query: PaginationQueryParameters },
	AsyncThunkConfig
>(`${sliceName}/load-all`, async ({ projectId, query }, { extra }) => {
	const { projectGroupApi } = extra;

	return await projectGroupApi.getAllByProjectId(projectId, query);
});

const deleteById = createAsyncThunk<boolean, { id: number }, AsyncThunkConfig>(
	`${sliceName}/delete-by-id`,
	async ({ id }, { extra }) => {
		const { projectGroupApi, toastNotifier } = extra;

		const isDeleted = await projectGroupApi.deleteById(id);

		if (isDeleted) {
			toastNotifier.showSuccess(
				NotificationMessage.PROJECT_GROUP_DELETE_SUCCESS,
			);
		}

		return isDeleted;
	},
);

const create = createAsyncThunk<
	ProjectGroupGetAllItemResponseDto,
	ProjectGroupCreateRequestDto,
	AsyncThunkConfig
>(`${sliceName}/create`, async (payload, { extra }) => {
	const { projectGroupApi, toastNotifier } = extra;

	const response = await projectGroupApi.create(payload);

	toastNotifier.showSuccess(NotificationMessage.PROJECT_GROUP_CREATE_SUCCESS);

	return response;
});

export { create, deleteById, loadAllByProjectId, loadUsers };