import { transaction } from "objection";

import { changeCase } from "~/libs/helpers/helpers.js";
import { type Repository } from "~/libs/types/types.js";

import { GroupEntity } from "./group.entity.js";
import { type GroupModel } from "./group.model.js";

class GroupRepository implements Repository {
	private groupModel: typeof GroupModel;

	public constructor(groupModel: typeof GroupModel) {
		this.groupModel = groupModel;
	}

	public async create(entity: GroupEntity): Promise<GroupEntity> {
		const { name, permissions, users } = entity.toNewObject();
		const key = changeCase(name, "snakeCase");

		const trx = await transaction.start(this.groupModel.knex());

		const groupData = {
			key,
			name,
			permissions,
			users,
		};

		const group = await this.groupModel
			.query(trx)
			.insertGraph(groupData, { relate: true })
			.returning("*")
			.withGraphJoined("[permissions, users]");

		await trx.commit();

		return GroupEntity.initialize({
			id: group.id,
			name: group.name,
			permissions,
			users,
		});
	}

	public delete(): ReturnType<Repository["delete"]> {
		return Promise.resolve(true);
	}

	public find(): ReturnType<Repository["find"]> {
		return Promise.resolve(null);
	}

	public findAll(): ReturnType<Repository["findAll"]> {
		return Promise.resolve([]);
	}

	public async findByName(name: string): Promise<GroupModel | null> {
		const key = changeCase(name, "snakeCase");
		const group = await this.groupModel.query().findOne({ key });

		return group ?? null;
	}

	public update(): ReturnType<Repository["update"]> {
		return Promise.resolve(null);
	}
}

export { GroupRepository };