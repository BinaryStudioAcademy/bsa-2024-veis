import { ExceptionMessage } from "~/libs/enums/enums.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Service } from "~/libs/types/types.js";

import { GroupEntity } from "./group.entity.js";
import { type GroupRepository } from "./group.repository.js";
import { GroupError } from "./libs/exceptions/exceptions.js";
import {
	type GroupCreateRequestDto,
	type GroupCreateResponseDto,
	type GroupGetAllResponseDto,
} from "./libs/types/types.js";

class GroupService implements Service {
	private groupRepository: GroupRepository;

	public constructor(groupRepository: GroupRepository) {
		this.groupRepository = groupRepository;
	}

	public async create(
		payload: GroupCreateRequestDto,
	): Promise<GroupCreateResponseDto> {
		const { name, permissionIds = [], userIds } = payload;

		const existingGroup = await this.groupRepository.findByName(name);

		if (existingGroup) {
			throw new GroupError({
				message: ExceptionMessage.GROUP_NAME_USED,
				status: HTTPCode.CONFLICT,
			});
		}

		const permissions = permissionIds.map((id) => ({ id }));
		const users = userIds.map((id) => ({ id }));

		const item = await this.groupRepository.create(
			GroupEntity.initializeNew({
				name,
				permissions,
				users,
			}),
		);

		return item.toObject();
	}

	public delete(): ReturnType<Service["delete"]> {
		return Promise.resolve(true);
	}

	public find(): ReturnType<Service["find"]> {
		return Promise.resolve(null);
	}

	public async findAll(): Promise<GroupGetAllResponseDto> {
		return await this.groupRepository.findAll();
	}

	public update(): ReturnType<Service["update"]> {
		return Promise.resolve(null);
	}
}

export { GroupService };
