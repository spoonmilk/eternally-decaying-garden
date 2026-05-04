import Link from "next/link";
import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export default async function Home() {
    const textFilePath = path.join(process.cwd(), 'content', 'introduction.md')
    const text = await fs.readFile(textFilePath, 'utf8');

    return (
        <main
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
            }}
        >
            <div style={{ border: "1px solid", width: 600 }}>
                <div style={{ borderBottom: "1px solid", padding: 8 }}>
                    The Internet as an Eternally Decaying Garden
                </div>

                <section style={{ padding: 24 }}>
                    <ReactMarkdown>{text}</ReactMarkdown>
                </section>

                <nav
                    style={{
                        borderTop: "1px solid",
                        padding: 8,
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <button type="button">← Back</button>
                    <Link href="/explore" passHref>
                        <button type="button">Next →</button>
                    </Link>
                </nav>
            </div>
        </main>
    );
}
