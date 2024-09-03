import { APIPath } from "~/libs/enums/enums.js";
import {
	type APIHandlerOptions,
	type APIHandlerResponse,
	BaseController,
} from "~/libs/modules/controller/controller.js";
import { HTTPCode } from "~/libs/modules/http/http.js";
import { type Logger } from "~/libs/modules/logger/logger.js";

import { ProjectsApiPath } from "./libs/enums/enums.js";
import {
	type ProjectCreateRequestDto,
	type ProjectGetAllRequestDto,
} from "./libs/types/types.js";
import { projectCreateValidationSchema } from "./libs/validation-schemas/validation-schemas.js";
import { type ProjectService } from "./project.service.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           minimum: 1
 *         name:
 *           type: string
 *           maxLength: 50
 *         description:
 *           type: string
 *           maxLength: 1000
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

class ProjectController extends BaseController {
	private projectService: ProjectService;

	public constructor(logger: Logger, projectService: ProjectService) {
		super(logger, APIPath.PROJECTS);

		this.projectService = projectService;

		this.addRoute({
			handler: (options) =>
				this.create(
					options as APIHandlerOptions<{
						body: ProjectCreateRequestDto;
					}>,
				),
			method: "POST",
			path: ProjectsApiPath.ROOT,
			validation: {
				body: projectCreateValidationSchema,
			},
		});

		this.addRoute({
			handler: (options) =>
				this.delete(
					options as APIHandlerOptions<{
						params: { id: string };
					}>,
				),
			method: "DELETE",
			path: ProjectsApiPath.$ID,
		});

		this.addRoute({
			handler: (options) =>
				this.findAllByName(
					options as APIHandlerOptions<{
						query: ProjectGetAllRequestDto;
					}>,
				),
			method: "GET",
			path: ProjectsApiPath.ROOT,
		});

		this.addRoute({
			handler: (options) =>
				this.getById(
					options as APIHandlerOptions<{
						params: { id: string };
					}>,
				),
			method: "GET",
			path: ProjectsApiPath.$ID,
		});
	}

	/**
	 * @swagger
	 * /projects:
	 *    post:
	 *      description: Add project into the system
	 *      requestBody:
	 *        description: Project data
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                name:
	 *                  type: string
	 *                description:
	 *                  type: string
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  message:
	 *                    type: object
	 *                    $ref: "#/components/schemas/Project"
	 */
	private async create(
		options: APIHandlerOptions<{
			body: ProjectCreateRequestDto;
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.projectService.create(options.body),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /projects/{id}:
	 *    get:
	 *      description: Deletes project by ID
	 *      parameters:
	 *        - in: path
	 *          name: id
	 *          schema:
	 *            type: integer
	 *          required: true
	 *          description: Numeric ID of the project to be deleted
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: boolean
	 */
	private async delete(
		options: APIHandlerOptions<{
			params: { id: string };
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.projectService.delete(Number(options.params.id)),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /projects:
	 *    get:
	 *      description: Returns an array of projects
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 * 								properties:
	 * 									items:
	 * 										type: array
	 *                		items:
	 *                  		$ref: "#/components/schemas/Project"
	 */
	private async findAllByName(
		options: APIHandlerOptions<{
			query: ProjectGetAllRequestDto;
		}>,
	): Promise<APIHandlerResponse> {
		const { query } = options;

		return {
			payload: await this.projectService.findAllbyName(query),
			status: HTTPCode.OK,
		};
	}

	/**
	 * @swagger
	 * /projects/{id}:
	 *    get:
	 *      description: Get project by ID
	 *      parameters:
	 *        - in: path
	 *          name: id
	 *          schema:
	 *            type: integer
	 *          required: true
	 *          description: Numeric ID of the project to retrieve
	 *      responses:
	 *        200:
	 *          description: Successful operation
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  message:
	 *                    type: object
	 *                    $ref: "#/components/schemas/Project"
	 */
	private async getById(
		options: APIHandlerOptions<{
			params: { id: string };
		}>,
	): Promise<APIHandlerResponse> {
		return {
			payload: await this.projectService.find(Number(options.params.id)),
			status: HTTPCode.OK,
		};
	}
}

export { ProjectController };
