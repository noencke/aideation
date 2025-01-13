import { SchemaFactoryAlpha } from "fluid-framework/alpha";

const sf = new SchemaFactoryAlpha("com.microsoft.aideation");

export class Note extends sf.object("Note", {
    id: sf.identifier,
    text: sf.string,
    x: sf.number,
    y: sf.number,
}) { }

export class Canvas extends sf.object("Canvas", {
    width: sf.number,
    height: sf.number,
    notes: sf.array(Note),
}) { }

