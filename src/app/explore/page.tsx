export default function Explore() {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <header style={{ border: "1px solid", borderBottom: "1px solid", padding: 8, display: "flex", justifyContent: "space-between" }}>
                <span>Timer xx:xx</span>
                <span>Budget</span>
            </header>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1, borderRight: "1px solid", overflow: "hidden" }}>
                    <nav style={{ borderBottom: "1px solid", padding: 8, display: "flex", gap: 8 }}>
                        <input type="text" defaultValue="https://cel.cs.brown.edu/csci-1377-s26/" readOnly style={{ flex: 1, border: "1px solid" }} />
                    </nav>

                    <article style={{ flex: 1, overflow: "auto", padding: 24 }}>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore consequuntur fugit fugiat nostrud labore dolor quasi proident dignissimos quas ullamco similique. Est ea fugiat sunt magna corrupti vero blanditiis tempor explicabo odio aliqua esse aute laborum. Est voluptatum magnam eiusmod ipsa deserunt magni aspernatur nesciunt atque cupiditate inventore similique provident quasi. Magni architecto ullamco minim sed qui deleniti ex magni eiusmod tempora porro voluptate aspernatur consequat. Illo ipsum ad excepturi quas non obcaecati duis at sequi. Lorem architecto quisquam mollitia labore commodo. Aut nulla in quia nemo qui magni inventore dolorem.

                            Exercitation ea ipsum exercitation dolores duis architecto quos excepteur incididunt accusamus ipsum aliqua fugiat nisi. Iusto culpa numquam aliqua atque. Dignissimos cupiditate cupidatat eius ut quis veniam laborum aut vitae enim. Dolore eos ullamco in mollitia pariatur. Adipiscing architecto quia dolor sit.

                            Velit obcaecati exercitation numquam non irure tempor. Reprehenderit molestias iusto nisi provident quae. Cupidatat ullamco aut ducimus ut officia excepteur inventore.
                        </p>
                    </article>
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
