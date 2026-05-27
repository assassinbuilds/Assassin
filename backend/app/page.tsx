export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "2rem",
        fontFamily: "var(--font-geist-sans)",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#dc2626",
          fontSize: "0.75rem",
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        TechAssassin
      </p>
      <h1 style={{ margin: 0, fontSize: "2rem" }}>Backend API Online</h1>
      <p
        style={{
          margin: 0,
          maxWidth: "34rem",
          color: "#6b7280",
          lineHeight: 1.6,
        }}
      >
        This service powers TechAssassin API routes. Use <code>/api/health</code> to check service health.
      </p>
    </main>
  );
}
