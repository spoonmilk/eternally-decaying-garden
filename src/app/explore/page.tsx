import ExploreFrame from "./explore-frame";

export default function Explore() {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <header style={{ border: "1px solid", borderBottom: "1px solid", padding: 8, display: "flex", justifyContent: "space-between" }}>
                <span>Timer xx:xx</span>
                <span>Budget</span>
            </header>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1, borderRight: "1px solid", overflow: "hidden" }}>
                    <ExploreFrame />
                </div>

                <aside style={{ display: "flex", flexDirection: "column", width: 240, overflow: "hidden" }}>
                    <div style={{ borderBottom: "1px solid", padding: 8 }}>Preserved</div>

                    <ul style={{ flex: 1, overflow: "auto", padding: 8, listStyle: "none", margin: 0 }}>
                        <li style={{ border: "1px solid", padding: 8, marginBottom: 8 }}>
                            <span>Something</span>
                            <p>Some text</p>
                        </li>
                        <li style={{ border: "1px solid", padding: 8 }}>
                            <span>Note</span>
                            <p>Blah blah blah</p>
                        </li>
                    </ul>

                    <div style={{ borderTop: "1px solid", padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                        <button type="button">+ Highlight</button>
                        <button type="button">+ Note</button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
