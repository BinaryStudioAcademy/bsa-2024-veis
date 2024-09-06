import { APIPath } from "~/libs/enums/enums.js";
import { BaseHTTPApi } from "~/libs/modules/api/api.js";
import { type HTTP } from "~/libs/modules/http/http.js";
import { type Storage } from "~/libs/modules/storage/storage.js";
import { type PaginationQueryParameters } from "~/libs/types/types.js";

import { GroupsApiPath } from "./libs/enums/enums.js";
import { type GroupGetAllResponseDto } from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class GroupApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.GROUPS, storage });
	}

	public async deleteById(id: number): Promise<boolean> {
		const response = await this.load(
			this.getFullEndpoint(GroupsApiPath.$ID, { id: String(id) }),
			{
				hasAuth: true,
				method: "DELETE",
			},
		);

		return await response.json<boolean>();
	}

	public async getAll(
		query: PaginationQueryParameters,
	): Promise<GroupGetAllResponseDto> {
		const response = await this.load(
			this.getFullEndpoint(GroupsApiPath.ROOT, {}),
			{
				hasAuth: true,
				method: "GET",
				query: {
					page: String(query.page),
					pageSize: String(query.pageSize),
				},
			},
		);

		return await response.json<GroupGetAllResponseDto>();
	}
}

export { GroupApi };
