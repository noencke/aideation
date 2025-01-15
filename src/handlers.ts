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
                        (item) => item.text === action.parameters.todoText,
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
