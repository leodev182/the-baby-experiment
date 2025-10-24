import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminStats } from "./AdminStats";
import { AdminWall } from "./AdminWall";
import type { PredictionDraft } from "@/services/localStorageService";

type Tab = "stats" | "wall";

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [predictions, setPredictions] = useState<PredictionDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setIsLoading(true);
      const predictionsRef = collection(db, "predictions");
      const snapshot = await getDocs(predictionsRef);

      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        userId: doc.id,
      })) as PredictionDraft[];

      setPredictions(data);
      console.log("📊 Predicciones cargadas:", data.length);
    } catch (error) {
      console.error("❌ Error cargando predicciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">🔬</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Admin Panel
            </h1>
          </div>
          <p className="text-purple-200">Baby Reveal Experiment v1.0</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "stats"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-white/10 text-purple-200 hover:bg-white/20"
            }`}
          >
            📊 Estadísticas
          </button>
          <button
            onClick={() => setActiveTab("wall")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "wall"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                : "bg-white/10 text-purple-200 hover:bg-white/20"
            }`}
          >
            📋 Muro de Predicciones
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-cyan-400 text-xl mb-4 animate-pulse">
                🔬 Cargando datos...
              </div>
              <div className="text-purple-200">
                Leyendo predicciones desde Firestore
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {activeTab === "stats" && <AdminStats predictions={predictions} />}
            {activeTab === "wall" && (
              <AdminWall
                predictions={predictions}
                onRefresh={loadPredictions}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
