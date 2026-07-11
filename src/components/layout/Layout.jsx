import Navbar from "../navigation/Navbar.jsx";
import Footer from "./Footer.jsx";

export default function Layout({ children, apiCredit = false }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
      <Footer apiCredit={apiCredit} />
    </div>
  );
}
