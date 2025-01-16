import React from "react";
import "./App.css";
import { Tree } from "fluid-framework";
import { type Canvas, type Note, Todo } from "./schema";

function App({ canvas }: { canvas: Canvas }) {
	const [_, update] = React.useState(0);
	React.useEffect(() =>
		Tree.on(canvas, "treeChanged", () => update((i) => i + 1)),
	);

	const [drag, setDrag] = React.useState<{
		item: Note | Todo;
		itemStart: { x: number; y: number };
		dragStart: { x: number; y: number };
		dragging: boolean;
	}>();

	const notes = canvas.items.map((item) => (
		<div
			key={item.id}
			style={{
				position: "absolute",
				top: item.y,
				left: item.x,
				backgroundColor:
					item instanceof Todo
						? item.completed
							? "#b1f5aa"
							: "#faa6bd"
						: "#f5eca9",
				color: "black",
				width: "180px",
				height: "180px",
				display: "flex",
				flexDirection: "column",
			}}
			onMouseDown={(e) => {
				setDrag({
					item,
					dragging: false,
					itemStart: { x: item.x, y: item.y },
					dragStart: { x: e.clientX, y: e.clientY },
				});
				e.preventDefault();
			}}
			onMouseMove={(e) => {
				if (drag !== undefined) {
					if (!drag.dragging) {
						// Move to end of list to render on top
						const index = canvas.items.indexOf(drag.item);
						canvas.items.moveToEnd(index);
						drag.dragging = true;
					}
					drag.item.x = drag.itemStart.x + e.clientX - drag.dragStart.x;
					drag.item.y = drag.itemStart.y + e.clientY - drag.dragStart.y;
				}
			}}
			onMouseUp={(e) => {
				if (drag?.dragging === false) {
					if (item instanceof Todo) {
						item.completed = !item.completed;
					}
				}
				setDrag(undefined);
				e.preventDefault();
			}}
		>
			{
				<div
					style={{
						height: "24px",
						fontSize: "12px",
						fontStyle: "italic",
						fontWeight: "bold",
						alignContent: "center",
						padding: "2px",
						overflow: "hidden",
						flexShrink: "0",
						backgroundColor: "#FFFFFF80",
					}}
				>
					{todoCompletionText(item)}
				</div>
			}
			<div
				style={{
					width: "fit-content",
					overflow: "auto",
					padding: "2px 6px 2px 6px",
					fontSize: "14px",
					textAlign: "start",
				}}
				onMouseDown={(e) => {
					e.stopPropagation();
				}}
				onMouseUp={(e) => {
					e.stopPropagation();
				}}
			>
				{item.text}
			</div>
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

function prettyDate(datetime: string): string {
	const date = new Date(datetime);
	if (Number.isNaN(date.getTime())) {
		return datetime;
	}

	return date.toLocaleString();
}

function todoCompletionText(item: Note | Todo): string {
	if (item instanceof Todo) {
		if (item.completed) {
			return "Completed";
		}

		if (item.due !== undefined) {
			return `Due: ${prettyDate(item.due)}`;
		}

		return "TODO";
	}

	return "";
}
