import { useMemo } from "react";
import { BarChart3, Users, Award, TrendingUp } from "lucide-react";
import type { PredictionDraft } from "@/services/localStorageService";

interface AdminStatsProps {
  predictions: PredictionDraft[];
}

interface NameCount {
  name: string;
  count: number;
}

export const AdminStats = ({ predictions }: AdminStatsProps) => {
  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = predictions.length;
    const xyCount = predictions.filter((p) => p.hypothesis === "XY").length;
    const xxCount = predictions.filter((p) => p.hypothesis === "XX").length;
    const xyPercentage = total > 0 ? Math.round((xyCount / total) * 100) : 0;
    const xxPercentage = total > 0 ? Math.round((xxCount / total) * 100) : 0;

    // Calcular score promedio
    const totalScore = predictions.reduce(
      (sum, p) => sum + (p.scores?.total || 0),
      0
    );
    const averageScore = total > 0 ? Math.round(totalScore / total) : 0;

    // Contar nombres sugeridos
    const nameCountMap: Record<string, number> = {};
    predictions.forEach((p) => {
      if (p.suggestedName) {
        const name = p.suggestedName.trim();
        nameCountMap[name] = (nameCountMap[name] || 0) + 1;
      }
    });

    const namesArray: NameCount[] = Object.entries(nameCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Decidir si mostrar Top 5 o lista completa
    const namesWithRepetitions = namesArray.filter((n) => n.count >= 2);
    const showTopRanking = namesWithRepetitions.length >= 5;
    const displayNames = showTopRanking ? namesArray.slice(0, 5) : namesArray;

    return {
      total,
      xyCount,
      xxCount,
      xyPercentage,
      xxPercentage,
      averageScore,
      namesArray: displayNames,
      showTopRanking,
      totalUniqueNames: namesArray.length,
    };
  }, [predictions]);

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Predicciones */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <p className="text-purple-200 text-sm">Total Predicciones</p>
          </div>
          <p className="text-4xl font-bold text-white">{stats.total}</p>
        </div>

        {/* XY Count */}
        <div className="bg-blue-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <p className="text-blue-200 text-sm">Variable XY (Niño)</p>
          </div>
          <p className="text-4xl font-bold text-white">{stats.xyCount}</p>
          <p className="text-blue-300 text-sm mt-1">{stats.xyPercentage}%</p>
        </div>

        {/* XX Count */}
        <div className="bg-pink-500/20 backdrop-blur-lg rounded-xl p-6 border border-pink-500/30">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-pink-400" />
            <p className="text-pink-200 text-sm">Variable XX (Niña)</p>
          </div>
          <p className="text-4xl font-bold text-white">{stats.xxCount}</p>
          <p className="text-pink-300 text-sm mt-1">{stats.xxPercentage}%</p>
        </div>

        {/* Score Promedio */}
        <div className="bg-yellow-500/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-yellow-400" />
            <p className="text-yellow-200 text-sm">Score Promedio</p>
          </div>
          <p className="text-4xl font-bold text-white">{stats.averageScore}</p>
          <p className="text-yellow-300 text-sm mt-1">de 300 pts</p>
        </div>
      </div>

      {/* Gráfico de Porcentajes */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          Distribución de Hipótesis
        </h2>

        {stats.total > 0 ? (
          <div className="space-y-4">
            {/* XY Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-blue-300 font-semibold">XY (Niño)</span>
                <span className="text-white font-bold">
                  {stats.xyPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-end pr-3 transition-all duration-1000"
                  style={{ width: `${stats.xyPercentage}%` }}
                >
                  {stats.xyPercentage > 10 && (
                    <span className="text-white font-bold text-sm">
                      {stats.xyCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* XX Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-pink-300 font-semibold">XX (Niña)</span>
                <span className="text-white font-bold">
                  {stats.xxPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-pink-400 flex items-center justify-end pr-3 transition-all duration-1000"
                  style={{ width: `${stats.xxPercentage}%` }}
                >
                  {stats.xxPercentage > 10 && (
                    <span className="text-white font-bold text-sm">
                      {stats.xxCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-purple-200 text-center py-8">
            Aún no hay predicciones registradas
          </p>
        )}
      </div>

      {/* Nombres Sugeridos */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          {stats.showTopRanking ? "🏆" : "💝"}{" "}
          {stats.showTopRanking
            ? "Top 5 Nombres Más Votados"
            : "Nombres Sugeridos por los Colaboradores"}
        </h2>

        {stats.namesArray.length > 0 ? (
          <>
            {!stats.showTopRanking && (
              <p className="text-purple-200 mb-4 text-sm">
                Todos los nombres tienen igual peso
              </p>
            )}

            <div className="space-y-3">
              {stats.namesArray.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {stats.showTopRanking ? (
                    <div className="text-3xl">
                      {index === 0 && "🥇"}
                      {index === 1 && "🥈"}
                      {index === 2 && "🥉"}
                      {index > 2 && (
                        <span className="text-white font-bold">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-purple-400 text-xl">•</div>
                  )}

                  <div className="flex-1">
                    <p className="text-white font-semibold text-lg">
                      {item.name}
                    </p>
                  </div>

                  {stats.showTopRanking && (
                    <div className="text-right">
                      <p className="text-purple-300 text-sm">
                        {item.count} {item.count === 1 ? "voto" : "votos"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!stats.showTopRanking && (
              <p className="text-purple-300 text-sm mt-4 text-center">
                Total: {stats.totalUniqueNames} nombres únicos
              </p>
            )}
          </>
        ) : (
          <p className="text-purple-200 text-center py-8">
            Aún no hay nombres sugeridos
          </p>
        )}
      </div>
    </div>
  );
};
