import { usePointerField } from "../../hooks/usePointerField.js";

/**
 * A fixed, full-viewport aurora field made of three soft radial blobs.
 * Position and drift are driven entirely by CSS custom properties that
 * usePointerField() updates on <html> via requestAnimationFrame, so this
 * component itself never re-renders — everything animates on the
 * compositor thread (transform/opacity only) for a steady 60fps.
 */
export default function AuroraBackground() {
  usePointerField();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.9]"
        style={{
          background:
            "radial-gradient(600px circle at var(--aurora-x) var(--aurora-y), var(--color-accent-soft), transparent 60%)",
          transition: "background 0.2s linear",
        }}
      />

      <div className="absolute -top-1/4 -left-1/4 h-[60vw] w-[60vw] max-w-[900px] max-h-[900px] rounded-full blur-[110px] opacity-40 animate-float"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
      />
      <div className="absolute top-1/3 -right-1/4 h-[50vw] w-[50vw] max-w-[760px] max-h-[760px] rounded-full blur-[110px] opacity-30 animate-float-delay"
        style={{ background: "radial-gradient(circle, var(--color-accent-cyan) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-[-20%] left-1/3 h-[45vw] w-[45vw] max-w-[680px] max-h-[680px] rounded-full blur-[100px] opacity-20 animate-float"
        style={{
          background: "radial-gradient(circle, var(--rank-color, var(--color-accent)) 0%, transparent 70%)",
          animationDuration: "9s",
        }}
      />

      <div className="absolute inset-0 bg-grain mix-blend-overlay opacity-[0.05]" />

      <div className="absolute inset-0 [background:linear-gradient(180deg,transparent,var(--color-base)_92%)] opacity-90" />
    </div>
  );
}
