export type Action = NewNote;

interface NewNote {
	actionName: "newNote";
	parameters: {
		text: string;
	};
}
