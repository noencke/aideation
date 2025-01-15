export type Action = NewNote | NewTodo | CompleteTodo;

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
		todoText: string;
	};
}

// TODO: This type is more fully defined in the TypeAgent repo
// interface AppAction {
//     actionName: string;
//     parameters?: Record<string, unknown>;
// }
