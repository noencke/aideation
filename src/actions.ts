export type Action = NewNote | NewTodo | CompleteTodo | Organize;

interface NewNote {
	actionName: "newNote";
	parameters: {
		text: string;
	};
}

interface NewTodo {
	actionName: "newTodo";
	parameters: {
		todo: string;
		due: string | undefined;
	};
}

interface CompleteTodo {
	actionName: "completeTodo";
	parameters: {
		todo: string;
	};
}

interface Organize {
	actionName: "organize";
	parameters: {
		todoGroups: string[][]; // Array of todo text arrays
	};
}

// TODO: This type is more fully defined in the TypeAgent repo
// interface AppAction {
//     actionName: string;
//     parameters?: Record<string, unknown>;
// }
