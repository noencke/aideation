import type { Action } from "./actions";
import { type Canvas, Note, Todo } from "./schema";

export interface AgentContext {
	canvas(): Canvas;
}

export function createAgent(context: AgentContext): AppAgent {
	return {
		async executeAction(action: Action): Promise<ActionResult> {
			const canvas = context.canvas();
			switch (action.actionName) {
				case "newNote": {
					const x = Math.floor(Math.random() * canvas.width);
					const y = Math.floor(Math.random() * canvas.height);
					canvas.items.insertAtEnd(
						new Note({ text: action.parameters.text, x, y }),
					);
					return {
						entities: [],
						displayContent: "Added that note for you!",
					};
				}
				case "newTodo": {
					const x = Math.floor(Math.random() * canvas.width);
					const y = Math.floor(Math.random() * canvas.height);
					canvas.items.insertAtEnd(
						new Todo({ text: action.parameters.todo, x, y, completed: false }),
					);
					return {
						entities: [],
						displayContent: "Added that todo for you!",
					};
				}
				default:
					return {
						error: "Unknown sticky note action",
					};
			}
		},
	};
}

type AppAgent = unknown; // TODO: This type is defined in the TypeAgent repo
type ActionResult = Record<string, unknown>; // TODO: This type is defined in the TypeAgent repo
