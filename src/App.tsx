import React from "react";
import "./App.css";
import { Tree } from "fluid-framework";
import type { Canvas } from "./schema";

function App({ canvas }: { canvas: Canvas }) {
	const [_, update] = React.useState(0);
	React.useEffect(() =>
		Tree.on(canvas, "treeChanged", () => update((i) => i + 1)),
	);

	const notes = canvas.notes.map((note) => (
		<div
			key={note.id}
			style={{
				position: "absolute",
				top: note.y,
				left: note.x,
				backgroundColor: "yellow",
				color: "black",
				padding: "10px",
				border: "1px solid #999",
			}}
		>
			{note.text}
		</div>
	));

	return (
		<>
			<div
				style={{
					position: "relative",
					width: `${canvas.width}px`,
					height: `${canvas.height}px`,
					border: "1px solid #ccc",
				}}
			>
				{notes}
			</div>
		</>
	);
}

export default App;
