import Navbar from "../components/common/NavBar";

export default function StudentLayout({ children, noPadding = false }) {
  return (
    <div className="min-h-screen bg-[#F7FAFF] text-[#172B4D]">
      <Navbar />

      <main className={`mx-auto w-full ${noPadding ? '' : 'px-5 py-6 sm:px-8 lg:px-12 xl:px-16 lg:py-8'}`}>
        {children}
      </main>
    </div>
  );
}