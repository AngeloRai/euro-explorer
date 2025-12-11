import React from 'react';
import { CountryData } from '../types';
import { X, MapPin, Utensils, Coins, Users, MessageCircle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoCardProps {
  data: CountryData | null;
  loading: boolean;
  onClose: () => void;
  countryName?: string; // For loading state
}

const InfoCard: React.FC<InfoCardProps> = ({ data, loading, onClose, countryName }) => {
  return (
    <AnimatePresence>
      {(data || loading) && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-y-0 right-0 z-[100] w-full sm:w-[400px] bg-white shadow-2xl border-l-4 border-sky-400 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-sky-100 p-6 relative flex-shrink-0">
            {/* Improved Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 z-50 p-3 bg-white/60 hover:bg-white rounded-full transition-all text-sky-800 hover:shadow-md hover:scale-110 cursor-pointer active:scale-95"
              aria-label="Close"
              title="Close"
            >
              <X size={24} />
            </button>
            
            {loading ? (
              <div className="animate-pulse flex flex-col items-center justify-center py-4">
                <div className="h-12 w-12 bg-sky-200 rounded-full mb-4"></div>
                <div className="h-8 w-48 bg-sky-200 rounded mb-2"></div>
                <p className="text-sky-600 text-sm font-medium">Traveling to {countryName}...</p>
              </div>
            ) : data ? (
              <div className="text-center">
                <div className="text-6xl mb-2 filter drop-shadow-md">{data.emoji}</div>
                <h2 className="text-3xl font-bold text-sky-900">{data.name}</h2>
                <div className="inline-block mt-2 px-3 py-1 bg-sky-200 text-sky-800 rounded-full text-sm font-bold uppercase tracking-wider">
                  Europe
                </div>
              </div>
            ) : null}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-white">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-gray-100 h-24 rounded-xl"></div>
                ))}
              </div>
            ) : data ? (
              <>
                {/* Fast Facts Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <div className="flex items-center text-orange-500 mb-1">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-xs font-bold uppercase">Capital</span>
                    </div>
                    <p className="font-semibold text-gray-800">{data.capital}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                    <div className="flex items-center text-purple-500 mb-1">
                      <MessageCircle size={16} className="mr-1" />
                      <span className="text-xs font-bold uppercase">Language</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{data.languages.slice(0, 2).join(", ")}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                    <div className="flex items-center text-green-500 mb-1">
                      <Users size={16} className="mr-1" />
                      <span className="text-xs font-bold uppercase">People</span>
                    </div>
                    <p className="font-semibold text-gray-800">{data.population}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                    <div className="flex items-center text-yellow-600 mb-1">
                      <Coins size={16} className="mr-1" />
                      <span className="text-xs font-bold uppercase">Money</span>
                    </div>
                    <p className="font-semibold text-gray-800">{data.currency}</p>
                  </div>
                </div>

                {/* Fun Fact */}
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-2 -mr-2 text-sky-100 opacity-50">
                    <Lightbulb size={80} />
                  </div>
                  <h3 className="text-sky-800 font-bold mb-2 flex items-center relative z-10">
                    <Lightbulb size={20} className="mr-2 text-yellow-500" />
                    Did You Know?
                  </h3>
                  <p className="text-sky-900 leading-relaxed relative z-10">
                    {data.funFact}
                  </p>
                </div>

                {/* Landmarks */}
                <div>
                  <h3 className="text-gray-800 font-bold text-lg mb-3 flex items-center">
                    <span className="bg-red-100 p-1.5 rounded-lg text-red-500 mr-2">
                       <MapPin size={18} />
                    </span>
                    Famous Places
                  </h3>
                  <div className="space-y-3">
                    {data.landmarks.map((place, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-bold text-gray-800">{place.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{place.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Foods */}
                <div>
                  <h3 className="text-gray-800 font-bold text-lg mb-3 flex items-center">
                     <span className="bg-orange-100 p-1.5 rounded-lg text-orange-500 mr-2">
                       <Utensils size={18} />
                    </span>
                    Yummy Foods
                  </h3>
                  <div className="space-y-3">
                    {data.foods.map((food, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-bold text-gray-800">{food.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{food.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoCard;