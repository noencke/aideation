export type Action = NewNote;

interface NewNote {
    actionName: "newNote";
    text: string;
}