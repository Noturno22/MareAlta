type PageIntroProps = {
  kicker: string;
  title: string;
  accent?: string;
  lead?: string;
};

export default function PageIntro({ kicker, title, accent, lead }: PageIntroProps) {
  return (
    <section
      className="relative"
      style={{ background: "var(--bg)", borderBottom: "1px solid var(--edge)" }}
    >
      <div
        className="mx-auto w-full max-w-[1236px] px-10"
        style={{ paddingTop: 72, paddingBottom: 56 }}
      >
        <p
          className="font-display"
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.16em",
            color: "var(--accent)",
          }}
        >
          {kicker}
        </p>
        <h1
          className="font-display"
          style={{
            marginTop: 14,
            fontSize: 54,
            lineHeight: "58px",
            fontWeight: 800,
            color: "var(--text)",
          }}
        >
          {title}{" "}
          {accent && <span style={{ color: "var(--accent)" }}>{accent}</span>}
        </h1>
        {lead && (
          <p
            style={{
              marginTop: 18,
              maxWidth: 660,
              fontSize: 17,
              lineHeight: "27px",
              color: "var(--text-soft)",
            }}
          >
            {lead}
          </p>
        )}
      </div>
    </section>
  );
}
