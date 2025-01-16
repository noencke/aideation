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
					const todo = new Todo({
						text: action.parameters.todo,
						x,
						y,
						completed: false,
						due: action.parameters.due,
					});
					canvas.items.insertAtEnd(todo);
					return {
						entities: [
							{
								name: action.parameters.todo,
								type: ["todo"],
								additionalEntityText: action.parameters.todo,
								uniqueId: todo.id,
							},
						],
						displayContent: "Added that todo for you!",
					};
				}
				case "completeTodo": {
					const todo = canvas.items.find(
						(item) => item.text === action.parameters.todo,
					);
					if (todo instanceof Todo) {
						todo.completed = true;
						return {
							entities: [],
							displayContent: "Marked that as completed - way to go!",
						};
					}

					return {
						error: "Could not find that todo item, sorry!",
					};
				}
				case "organize": {
					let x = 0;
					let y = 0;
					for (const group of action.parameters.todoGroups) {
						for (const todoText of group) {
							const index = canvas.items.findIndex(
								(item) => item.text === todoText,
							);
							if (index !== -1) {
								canvas.items.moveToEnd(index);
								const todo = canvas.items.at(-1) as Todo;
								todo.x = x;
								todo.y = y;
								y += 100;
							}
						}
						if (y > 0) {
							x += 200;
							y = 0;
						}
					}
					return {
						entities: [],
						displayContent: "Organized those todos for you!",
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
