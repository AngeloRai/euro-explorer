import React, { useState, useCallback } from 'react';
import MapChart from './components/MapChart';
import InfoCard from './components/InfoCard';
import QuizView from './components/QuizView';
import { fetchCountryData } from './services/gemini';
import { CountryData, GeoJsonProperties } from './types';
import { Compass, BookOpen, Map as MapIcon, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map' | 'quiz'>('map');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cache, setCache] = useState<Record<string, CountryData>>({});
  const [error, setError] = useState<string | null>(null);

  const handleCountryClick = useCallback(async (geo: GeoJsonProperties) => {
    // Some TopoJSON files use 'name', others might use something else. Highcharts uses 'name'.
    const name = geo.name || geo['hc-key'];
    
    if (!name) return;
    
    // If clicking the same country, do nothing or maybe just ensure sidebar is open
    if (selectedCountry === name && (countryData || loading)) return;

    setSelectedCountry(name);
    setError(null);
    
    // Check cache first
    if (cache[name]) {
      setCountryData(cache[name]);
      return;
    }

    // Fetch from Gemini
    setLoading(true);
    setCountryData(null); // Clear previous data while loading

    try {
      const data = await fetchCountryData(name);
      setCountryData(data);
      setCache(prev => ({ ...prev, [name]: data }));
    } catch (err) {
      console.error(err);
      setError("Oops! We couldn't find facts for this place right now. Try again later!");
      setCountryData(null);
      setLoading(false); // Ensure loading is false on error
    } finally {
      // Note: we don't set loading false here because it causes flash. 
      // We set it inside InfoCard or just let data replace it.
      // Actually, standard practice is set loading false when data arrives.
      setLoading(false);
    }
  }, [cache, selectedCountry, countryData, loading]);

  const handleCloseCard = () => {
    setSelectedCountry(null);
    setCountryData(null);
    setLoading(false); // Explicitly stop loading
  };

  return (
    <div className="relative w-screen h-screen bg-sky-50 overflow-hidden flex flex-col">
      {/* Navbar / Header */}
      <header className="flex-none bg-white shadow-sm border-b border-sky-100 p-3 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="bg-sky-500 p-2 rounded-xl text-white shadow-lg shadow-sky-200">
                    <Compass size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight hidden sm:block">EuroExplorer</h1>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight sm:hidden">EuroExplorer</h1>
                    <p className="text-xs font-semibold text-sky-500 uppercase tracking-widest hidden sm:block">Interactive Learning Map</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                    onClick={() => setActiveTab('map')}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'map' 
                        ? 'bg-white text-sky-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <MapIcon size={16} className="mr-2" /> Map
                </button>
                <button 
                    onClick={() => setActiveTab('quiz')}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'quiz' 
                        ? 'bg-white text-sky-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <HelpCircle size={16} className="mr-2" /> Quiz
                </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 bg-sky-50 px-4 py-2 rounded-full text-sky-700 text-sm font-medium">
                <BookOpen size={18} />
                <span>5th Grade Edition</span>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative p-2 sm:p-4 lg:p-6 overflow-hidden">
        <div className="w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
           {activeTab === 'map' ? (
               <MapChart 
                 onCountryClick={handleCountryClick} 
                 selectedCountryName={selectedCountry}
               />
           ) : (
               <QuizView />
           )}
        </div>
      </main>

      {/* Flashcard / Sidebar (Only show if in Map mode, or keep persisting?) */}
      {/* We usually hide the sidebar if switching to Quiz mode, or let it stay? 
          For simplicity, let's keep it but it might be covered by QuizView if Z-index issues. 
          Let's hide it when tab is Quiz. 
      */}
      {activeTab === 'map' && (
        <InfoCard 
            data={countryData} 
            loading={loading} 
            onClose={handleCloseCard} 
            countryName={selectedCountry || ''}
        />
      )}

      {/* Error Toast */}
      {error && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-xl font-bold z-50 flex items-center animate-bounce">
            <span className="mr-2">⚠️</span> {error}
        </div>
      )}
    </div>
  );
};

export default App;