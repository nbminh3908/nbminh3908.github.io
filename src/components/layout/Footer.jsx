export default function Footer({ apiCredit = false }) {
  return (
    <footer className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-10 text-center text-xs text-ink-faint sm:px-6">
      {apiCredit ? (
        <span>
          Powered by{" "}
          <a
            href="https://docs.henrikdev.xyz/"
            target="_blank"
            rel="noreferrer"
            className="text-ink-muted underline decoration-dotted underline-offset-2 hover:text-accent"
          >
            HenrikDev API
          </a>{" "}
          and{" "}
          <a
            href="https://valorant-api.com/"
            target="_blank"
            rel="noreferrer"
            className="text-ink-muted underline decoration-dotted underline-offset-2 hover:text-accent"
          >
            Valorant-API
          </a>
        </span>
      ) : null}
      <span>&copy; 2026 Ngo Bao Minh. All rights reserved.</span>
    </footer>
  );
}
