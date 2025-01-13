import "./App.css";
import type { Canvas } from "./schema";

function App(props: { canvas: Canvas }) {
	return (
		<>
			<div style={{ position: "relative", width: "800px", height: "600px", border: "1px solid #ccc" }}>
				{props.canvas.notes.map((note) => (
					<div
						key={note.id}
						style={{
							position: "absolute",
							top: note.y,
							left: note.x,
							backgroundColor: "yellow",
							padding: "10px",
							border: "1px solid #999"
						}}
					>
						{note.text}
					</div>
				))}
			</div>
		</>
	);
}

export default App;
