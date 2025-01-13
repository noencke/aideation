import { SchemaFactoryAlpha } from "fluid-framework/alpha";

const sf = new SchemaFactoryAlpha("com.microsoft.aideation");

export class Note extends sf.object("Note", {
    content: sf.string,
    x: sf.number,
    y: sf.number,
}) { }

export class Canvas extends sf.object("Canvas", {
    notes: sf.array(Note),
}) { }

