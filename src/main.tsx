import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { AzureClient } from "@fluidframework/azure-client";
import {
	type IFluidContainer,
	type ITree,
	SharedTree,
	TreeViewConfiguration,
} from "fluid-framework";
import { createAgent } from "./handlers.ts";
import { Canvas } from "./schema.ts";

const schema = `
export type Action = NewNote;

interface NewNote {
    type: "NewNote";
    text: string;
}`;

const manifest = {
	emojiChar: "📝",
	description: "Agent to create and manage a canvas of sticky notes",
	schema: {
		description: "Agent with actions to create sticky notes",
		schemaFile: { content: schema, type: "ts" },
		schemaType: "Action",
	},
};

let registered = false;
document.addEventListener("DOMContentLoaded", () => {
	if (!registered) {
		console.log("Registering agent");
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(window as any)
			// TODO: You gotta be on port 9000 for this to work. This ought to be added to the docs.
			.registerTypeAgent(
				"stickyNotes",
				manifest,
				createAgent({ canvas: () => canvas }),
			)
			.then(() => {
				console.log("Agent registered");
			})
			.catch((e: Error) => {
				console.error("Failed to register agent", e);
			});
		registered = true;
	}
});

const token = { jwt: "local" };
const azureClient = new AzureClient({
	connection: {
		type: "local",
		endpoint: "http://localhost:7070",
		tokenProvider: {
			fetchOrdererToken: async () => token,
			fetchStorageToken: async () => token,
		},
	},
});

const containerId = location.hash.substring(1);

const containerSchema = { initialObjects: { tree: SharedTree } } as const;

async function getContainer(): Promise<
	IFluidContainer<typeof containerSchema>
> {
	if (containerId !== "") {
		return (await azureClient.getContainer(containerId, containerSchema, "2"))
			.container;
	}
	const container = (await azureClient.createContainer(containerSchema, "2"))
		.container;
	const tree = container.initialObjects.tree as ITree;
	const view = tree.viewWith(new TreeViewConfiguration({ schema: Canvas }));
	view.initialize({
		width: 800,
		height: 600,
		notes: [],
	});
	view.dispose();
	return container;
}

const container = await getContainer();
const tree = container.initialObjects.tree;
const view = tree.viewWith(new TreeViewConfiguration({ schema: Canvas }));
const canvas = view.root;

const rootElement = document.getElementById("root");
if (rootElement !== null) {
	createRoot(rootElement).render(
		<StrictMode>
			<App canvas={canvas} />
		</StrictMode>,
	);
}
