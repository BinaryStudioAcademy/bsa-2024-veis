import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { ProjectApi } from "./projects-api.js";

const projectApi = new ProjectApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { projectApi };
export {
	type ProjectGetAllItemResponseDto,
	type ProjectGetAllResponseDto,
	type ProjectUpdateRequestDto,
	type ProjectUpdateResponseDto,
} from "./libs/types/types.js";
export { projectUpdateValidationSchema } from "./libs/validation-schemas/validation-schemas.js";
export { actions, reducer } from "./slices/projects.js";
