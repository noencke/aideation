export type Action = NewNote | NewTodo;

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
		dueDate?: string | undefined;
	};
}

// TODO: This type is more fully defined in the TypeAgent repo
// interface AppAction {
//     actionName: string;
//     parameters?: Record<string, unknown>;
// }
