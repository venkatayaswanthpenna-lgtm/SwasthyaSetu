import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">SWASTHYASETU</h1>
        </div>
        <div>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow">
            Login
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
          Connect the Care Journey.
        </h2>
        <h3 className="text-3xl font-bold text-gray-700 mb-8">
          Track What Matters. Complete the Care.
        </h3>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          A digital care-continuity layer connecting patients, frontline health workers, healthcare facilities, referrals, diagnostics, treatment services, and follow-ups into one trackable Care Episode.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold text-blue-700 mb-3">Offline-First</h4>
            <p className="text-gray-600">Built for rural areas. Continue working without internet and sync securely when connected.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold text-blue-700 mb-3">Care Pathways</h4>
            <p className="text-gray-600">Transform every patient need into an executable, trackable sequence of healthcare steps.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-bold text-blue-700 mb-3">Verified Workers</h4>
            <p className="text-gray-600">Secure, role-based access ensuring data privacy and trusted care delivery.</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>&copy; {new Date().getFullYear()} SwasthyaSetu Platform. Public Healthcare Initiative.</p>
      </footer>
    </div>
  );
}
