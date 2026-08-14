import Navbar from "../components/common/NavBar";

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F7FAFF] text-[#172B4D]">
      <Navbar />

      <main className="mx-auto w-full max-w-300 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}