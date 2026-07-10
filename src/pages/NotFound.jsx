import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Layout from "../components/layout/Layout.jsx";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <Compass size={28} className="text-accent" />
        <h1 className="font-display text-2xl font-semibold">Page not found</h1>
        <p className="max-w-sm text-ink-muted">The page you're looking for doesn't exist. Let's get you back home.</p>
        <Link
          to="/"
          className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.03]"
        >
          Back to home
        </Link>
      </div>
    </Layout>
  );
}
