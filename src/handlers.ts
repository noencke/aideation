import type { Action } from "./actions";
import { Note, type Canvas } from "./schema";

export interface AgentContext {
    canvas(): Canvas;
}

export function createAgent(context: AgentContext): unknown {
    return {
        async executeAction(action: Action): Promise<void> {
            const canvas = context.canvas();
            switch (action.actionName) {
                case "newNote": {
                    const x = Math.floor(Math.random() * canvas.width);
                    const y = Math.floor(Math.random() * canvas.height);
                    canvas.notes.insertAtEnd(new Note({ text: action.parameters.text, x, y }));
                    break;
                }
                default:
                    throw new Error(`Unknown action type: ${action.actionName}`);
            }
        },
    };
}
