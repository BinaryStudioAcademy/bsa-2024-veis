import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { GroupApi } from "./groups-api.js";

const groupApi = new GroupApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { groupApi };
export {
	type GroupGetAllItemResponseDto,
	type GroupGetAllResponseDto,
} from "./libs/types/types.js";
export { actions, reducer } from "./slices/groups.js";