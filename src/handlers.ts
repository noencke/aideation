import type { Action } from "./agent/schema";
import type { Canvas } from "./schema";

export interface AgentContext {
    canvas: Canvas;
}

export function createAgent(context: AgentContext): unknown {
    return {
        async executeAction(action: Action): Promise<void> {
            const { canvas } = context;
            switch (action.type) {
                case "NewNote": {
                    const x = Math.floor(Math.random() * canvas.width);
                    const y = Math.floor(Math.random() * canvas.height);
                    canvas.notes.insertAtEnd({ text: action.text, x, y });
                    break;
                }
                default:
                    throw new Error(`Unknown action type: ${action.type}`);
            }
        }
    }
}