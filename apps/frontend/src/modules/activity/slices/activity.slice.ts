import { createSlice } from "@reduxjs/toolkit";

import { DataStatus } from "~/libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";

import { type ActivityLogGetAllItemAnalyticsResponseDto } from "../libs/types/types.js";
import { loadAll } from "./actions.js";

type State = {
	activityLogs: ActivityLogGetAllItemAnalyticsResponseDto[];
	dataStatus: ValueOf<typeof DataStatus>;
};

const initialState: State = {
	activityLogs: [],
	dataStatus: DataStatus.IDLE,
};

const { actions, name, reducer } = createSlice({
	extraReducers(builder) {
		builder.addCase(loadAll.pending, (state) => {
			state.dataStatus = DataStatus.PENDING;
		});
		builder.addCase(loadAll.fulfilled, (state, action) => {
			state.activityLogs = action.payload.items;
			state.dataStatus = DataStatus.FULFILLED;
		});
		builder.addCase(loadAll.rejected, (state) => {
			state.activityLogs = [];
			state.dataStatus = DataStatus.REJECTED;
		});
	},
	initialState,
	name: "activity",
	reducers: {},
});

export { actions, name, reducer };
