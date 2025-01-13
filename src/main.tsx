import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { AzureClient } from "@fluidframework/azure-client";
import { IFluidContainer, ITree, SharedTree, TreeViewConfiguration } from "fluid-framework";
import { Canvas } from "./schema.ts";

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
	} else {
		const container = (await azureClient.createContainer(containerSchema, "2")).container;
		const tree = container.initialObjects.tree as ITree;
		const view = tree.viewWith(new TreeViewConfiguration({ schema: Canvas }));
		view.initialize({ notes: [] });
		view.dispose();
		return container;
	}
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
