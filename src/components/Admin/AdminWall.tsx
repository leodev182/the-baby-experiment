// src/components/Admin/AdminWall.tsx
import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Calendar,
  Award,
  User,
  Heart,
  MessageSquare,
} from "lucide-react";
import type { PredictionDraft } from "@/services/localStorageService";

interface AdminWallProps {
  predictions: PredictionDraft[];
  onRefresh: () => void;
}

type FilterType = "all" | "XY" | "XX";
type SortType = "date" | "score";

export const AdminWall = ({ predictions, onRefresh }: AdminWallProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("date");

  // Filtrar y ordenar predicciones
  const filteredPredictions = useMemo(() => {
    let filtered = [...predictions];

    // Filtrar por hipótesis
    if (filter !== "all") {
      filtered = filtered.filter((p) => p.hypothesis === filter);
    }

    // Filtrar por búsqueda (nombre del científico o nombre sugerido)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.userName.toLowerCase().includes(term) ||
          p.suggestedName.toLowerCase().includes(term)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        // Convertir timestamps a números para comparar
        const getTime = (ts: any) => {
          if (!ts) return 0;
          if (typeof ts === "number") return ts;
          if (ts?.toDate) return ts.toDate().getTime();
          return 0;
        };
        return getTime(b.timestamp) - getTime(a.timestamp);
      } else {
        return (b.scores?.total || 0) - (a.scores?.total || 0);
      }
    });

    return filtered;
  }, [predictions, filter, searchTerm, sortBy]);

  // Exportar CSV
  const exportCSV = () => {
    const headers = [
      "Nombre",
      "Hipótesis",
      "Nombre Sugerido",
      "Score Total",
      "Mensaje",
      "Fecha",
    ];
    const rows = predictions.map((p) => {
      // Convertir timestamp a fecha legible
      let dateStr = "N/A";
      if (p.timestamp) {
        let date: Date;
        if (typeof p.timestamp === "number") {
          date = new Date(p.timestamp);
        } else if (p.timestamp?.toDate) {
          date = p.timestamp.toDate();
        } else {
          date = new Date();
        }
        dateStr = date.toLocaleString("es-CL");
      }

      return [
        p.userName,
        p.hypothesis || "",
        p.suggestedName,
        p.scores?.total || 0,
        `"${p.message.replace(/"/g, '""')}"`, // Escapar comillas
        dateStr,
      ];
    });

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n"
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `predicciones_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  // Exportar JSON
  const exportJSON = () => {
    const json = JSON.stringify(predictions, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `predicciones_${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y filtros */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre del científico o nombre sugerido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filtros y ordenamiento */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Filtro por hipótesis */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-white/10 text-purple-200 hover:bg-white/20"
                }`}
              >
                Todos ({predictions.length})
              </button>
              <button
                onClick={() => setFilter("XY")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === "XY"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-blue-200 hover:bg-white/20"
                }`}
              >
                XY ({predictions.filter((p) => p.hypothesis === "XY").length})
              </button>
              <button
                onClick={() => setFilter("XX")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === "XX"
                    ? "bg-pink-600 text-white"
                    : "bg-white/10 text-pink-200 hover:bg-white/20"
                }`}
              >
                XX ({predictions.filter((p) => p.hypothesis === "XX").length})
              </button>
            </div>

            {/* Ordenamiento */}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setSortBy("date")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  sortBy === "date"
                    ? "bg-cyan-600 text-white"
                    : "bg-white/10 text-cyan-200 hover:bg-white/20"
                }`}
              >
                📅 Por Fecha
              </button>
              <button
                onClick={() => setSortBy("score")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  sortBy === "score"
                    ? "bg-yellow-600 text-white"
                    : "bg-white/10 text-yellow-200 hover:bg-white/20"
                }`}
              >
                ⭐ Por Score
              </button>
            </div>
          </div>

          {/* Botones de exportar */}
          <div className="flex gap-3 pt-2 border-t border-white/20">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
            <button
              onClick={exportJSON}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all"
            >
              <Download className="w-4 h-4" />
              Exportar JSON
            </button>
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all ml-auto"
            >
              🔄 Recargar
            </button>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-center">
        <p className="text-purple-200">
          Mostrando{" "}
          <span className="text-white font-bold">
            {filteredPredictions.length}
          </span>{" "}
          de <span className="text-white font-bold">{predictions.length}</span>{" "}
          predicciones
        </p>
      </div>

      {/* Lista de predicciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPredictions.length > 0 ? (
          filteredPredictions.map((prediction) => (
            <div
              key={prediction.userId}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 transition-all hover:shadow-xl hover:scale-105 ${
                prediction.hypothesis === "XY"
                  ? "border-blue-500/30 hover:border-blue-500/60"
                  : "border-pink-500/30 hover:border-pink-500/60"
              }`}
            >
              {/* Header con nombre y hipótesis */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <User
                    className={`w-6 h-6 ${
                      prediction.hypothesis === "XY"
                        ? "text-blue-400"
                        : "text-pink-400"
                    }`}
                  />
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {prediction.userName}
                    </h3>
                    <p
                      className={`text-sm font-semibold ${
                        prediction.hypothesis === "XY"
                          ? "text-blue-300"
                          : "text-pink-300"
                      }`}
                    >
                      {prediction.hypothesis === "XY"
                        ? "🔵 XY (Niño)"
                        : "🌸 XX (Niña)"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Award className="w-5 h-5" />
                    <span className="font-bold text-lg">
                      {prediction.scores?.total || 0}
                    </span>
                  </div>
                  <p className="text-xs text-purple-300">pts</p>
                </div>
              </div>

              {/* Nombre sugerido */}
              <div className="mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-400" />
                <p className="text-white">
                  <span className="text-purple-300 text-sm">
                    Nombre sugerido:
                  </span>{" "}
                  <span className="font-semibold">
                    {prediction.suggestedName}
                  </span>
                </p>
              </div>

              {/* Mensaje */}
              {prediction.message && (
                <div className="mb-3 flex items-start gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                  <p className="text-purple-200 text-sm italic">
                    "{prediction.message}"
                  </p>
                </div>
              )}

              {/* Fecha */}
              <div className="flex items-center gap-2 text-purple-300 text-sm pt-3 border-t border-white/10">
                <Calendar className="w-4 h-4" />
                <span>
                  {(() => {
                    if (!prediction.timestamp) return "Fecha no disponible";

                    // Convertir timestamp de Firebase a Date
                    let date: Date;
                    if (typeof prediction.timestamp === "number") {
                      date = new Date(prediction.timestamp);
                    } else if (prediction.timestamp?.toDate) {
                      // Es un Timestamp de Firebase
                      date = prediction.timestamp.toDate();
                    } else {
                      return "Fecha no disponible";
                    }

                    return date.toLocaleString("es-CL", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  })()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white text-xl font-bold mb-2">
              No se encontraron predicciones
            </p>
            <p className="text-purple-200">
              {searchTerm
                ? "Intenta con otro término de búsqueda"
                : "Aún no hay predicciones registradas"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
