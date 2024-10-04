import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const executeCommand = async (
	command: string,
	cwd: string,
): Promise<{ stderr: Buffer | string; stdout: Buffer | string }> => {
	return await execAsync(command, { cwd });
};

export { executeCommand };
