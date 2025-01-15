import React from "react";
import "./App.css";
import { Tree } from "fluid-framework";
import { type Note, Todo, type Canvas } from "./schema";

function App({ canvas }: { canvas: Canvas }) {
	const [_, update] = React.useState(0);
	React.useEffect(() =>
		Tree.on(canvas, "treeChanged", () => update((i) => i + 1)),
	);

	const [drag, setDrag] = React.useState<{ item: Note | Todo, dragging: boolean }>();

	const notes = canvas.items.map((item) => (
		<div
			key={item.id}
			style={{
				position: "absolute",
				top: item.y,
				left: item.x,
				backgroundColor: item instanceof Todo ? item.completed ? "green" : "red" : "yellow",
				color: "black",
				padding: "10px",
				border: "1px solid #999",
			}}
			onMouseDown={() => {
				setDrag({ item, dragging: false });
			}}
			onMouseUp={() => {
				if (drag?.dragging !== true) {
					if (item instanceof Todo) {
						item.completed = !item.completed;
					}
				}
				setDrag(undefined);
			}}
		>
			{item.text}
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
				onMouseMove={(e) => {
					if (drag !== undefined) {
						drag.item.x += e.movementX;
						drag.item.y += e.movementY;
						drag.dragging = true;
					}
				}}
				onMouseLeave={() => {
					setDrag(undefined);
				}}
			>
				{notes}
			</div>
		</>
	);
}

export default App;
