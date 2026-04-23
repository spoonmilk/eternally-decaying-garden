export default function Home() {
    return (
        <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
            <div style={{ border: "1px solid", width: 600 }}>
                <div style={{ borderBottom: "1px solid", padding: 8 }}>
                    The Internet as an Eternally Decaying Garden
                </div>

                <section style={{ padding: 24 }}>
                    <h1>Lorem ipsum dolor sit amet</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </section>

                <nav style={{ borderTop: "1px solid", padding: 8, display: "flex", justifyContent: "space-between" }}>
                    <button type="button">← Back</button>
                    <button type="button">Next →</button>
                </nav>
            </div>
        </main>
    );
}
