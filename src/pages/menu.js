import Navbar from "../components/Navbar";

export default function MyEfreiPage() {
  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Accueil</h1>
        <div className="w-full h-96 bg-gray-100 mt-4 rounded-lg"></div>
      </div>
    </div>
  );
}
