// CJS/ESM 🫠
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-plus-operands */
import generate, { GeneratorOptions } from "@babel/generator";

import { CollectibleNode } from "./types.js";

const printOptions: GeneratorOptions = {
	comments: true,
	minified: true,
	retainFunctionParens: true,
	retainLines: true,
};

export function reprintAst(code: string, collectedNodes: CollectibleNode[]) {
	if (!collectedNodes.length) {
		return code;
	}

	let output = "";
	let lastEnd = 0;

	/* eslint-disable @typescript-eslint/no-non-null-assertion */
	for (const collectedNode of collectedNodes) {
		output += code.slice(lastEnd, collectedNode.start!);

		// See https://github.com/prettier/prettier/issues/9114 for a Prettier AST format API.

		// @ts-ignore
		output += (generate.default ?? generate)(
			collectedNode,
			printOptions,
		).code.trim();

		lastEnd = collectedNode.end!;
	}
	/* eslint-enable @typescript-eslint/no-non-null-assertion */

	return output + code.slice(lastEnd);
}

/* eslint-enable */
