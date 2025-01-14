export type Action = NewNote;

interface NewNote {
    type: "NewNote";
    text: string;
}