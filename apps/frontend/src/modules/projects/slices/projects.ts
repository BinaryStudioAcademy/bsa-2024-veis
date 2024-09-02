import { create, getById, loadAll, update } from "./actions.js";
import { actions } from "./project.slice.js";

const allActions = {
	...actions,
	create,
	getById,
	loadAll,
	update,
};

export { allActions as actions };
export { reducer } from "./project.slice.js";
