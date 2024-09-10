import { APIPath, ContentType } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";

import { ProjectGroupsApiPath } from "./libs/enums/enums.js";
import {
	type ProjectGroupCreateRequestDto,
	type ProjectGroupGetAllItemResponseDto,
	type ProjectGroupGetAllResponseDto,
} from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class ProjectGroupApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.PROJECT_GROUPS, storage });
	}
	public async create(
		payload: ProjectGroupCreateRequestDto,
	): Promise<ProjectGroupGetAllItemResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(ProjectGroupsApiPath.ROOT, {}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: "POST",
				payload: JSON.stringify(payload),
			},
		);

		return await response.json<ProjectGroupGetAllItemResponseDto>();
	}

	public async getAllByProjectId(payload: {
		projectId: string;
	}): Promise<ProjectGroupGetAllResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(ProjectGroupsApiPath.$ID, {
				id: payload.projectId,
			}),
			{
				contentType: ContentType.JSON,
				hasAuth: true,
				method: "GET",
			},
		);

		return await response.json<ProjectGroupGetAllResponseDto>();
	}
}

export { ProjectGroupApi };