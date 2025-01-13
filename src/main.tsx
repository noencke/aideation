import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { AzureClient } from "@fluidframework/azure-client";
import { type IFluidContainer, type ITree, SharedTree, TreeViewConfiguration } from "fluid-framework";
import { Canvas } from "./schema.ts";
import { createAgent } from "./handlers.ts";

const schema = `
export type Action = NewNote;

interface NewNote {
    type: "NewNote";
    text: string;
}`;

const manifest = {
	emojiChar: "📝",
	description: "Agent to create and manage a canvas of notes",
	schema: {
		description: "Agent with actions to create notes",
		schemaFile: { content: schema, type: "ts" },
		schemaType: "Action"
	}
}

const token = { jwt: "local" };
const azureClient = new AzureClient({
	connection: {
		type: "local",
		endpoint: "http://localhost:7070",
		tokenProvider: {
			fetchOrdererToken: async () => token,
			fetchStorageToken: async () => token,
		}
	}
});

const containerId = location.hash.substring(1);

const containerSchema = { initialObjects: { tree: SharedTree } } as const;

async function getContainer(): Promise<IFluidContainer<typeof containerSchema>> {
	if (containerId !== '') {
		return (await azureClient.getContainer(containerId, containerSchema, "2")).container;
	}
	const container = (await azureClient.createContainer(containerSchema, "2")).container;
	const tree = container.initialObjects.tree as ITree;
	const view = tree.viewWith(new TreeViewConfiguration({ schema: Canvas }));
	view.initialize({
		width: 800,
		height: 600,
		notes: []
	});
	view.dispose();
	return container;
}

const container = await getContainer();
const tree = container.initialObjects.tree;
const view = tree.viewWith(new TreeViewConfiguration({ schema: Canvas }));
const canvas = view.root;

// TODO: Get this working by importing the correct typeagent module
let registered = false;
document.addEventListener("DOMContentLoaded", () => {
	if (!registered) {
		console.log("Registering agent");
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(window as any)
			.registerTypeAgent("turtle", manifest, createAgent({ canvas }))
			.then(() => {
				console.log("Agent registered");
			})
			.catch((e: Error) => {
				console.error("Failed to register turtle agent", e);
			});
		registered = true;
	}
});

const rootElement = document.getElementById("root");
if (rootElement !== null) {
	createRoot(rootElement).render(
		<StrictMode>
			<App canvas={canvas} />
		</StrictMode>,
	);
}
