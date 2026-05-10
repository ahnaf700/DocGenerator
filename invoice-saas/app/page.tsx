'use client';

import { useState } from 'react';

interface FormData {
  nama_klien: string;
  layanan: string;
  harga: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    nama_klien: '', layanan: '', harga: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Kirim data state ke API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Gagal memproses data');

      // 2. Logika untuk mengunduh file hasil dari backend
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${formData.nama_klien.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      alert("Terjadi kesalahan sistem.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">Generator Invoice</h1>
        
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nama Klien</label>
            <input 
              required type="text" name="nama_klien" value={formData.nama_klien} onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="Ex: ACME Corp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Layanan</label>
            <input 
              required type="text" name="layanan" value={formData.layanan} onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="Ex: Website Development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Harga (USD)</label>
            <input 
              required type="number" name="harga" value={formData.harga} onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="Ex: 1500"
            />
          </div>

          <button 
            type="submit" disabled={isLoading}
            className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
          >
            {isLoading ? 'Processing...' : 'Create & Download PDF'}
          </button>
        </form>
      </div>
    </main>
  );
}