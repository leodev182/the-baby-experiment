import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllConfirmations } from "@/services/babyShowerService";
import type { BabyShowerConfirmation } from "@/types";

export function BabyShowerConfirmationsPublic() {
  const [confirmations, setConfirmations] = useState<BabyShowerConfirmation[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadConfirmations();
  }, []);

  async function loadConfirmations() {
    try {
      const data = await getAllConfirmations();
      setConfirmations(data);
    } catch (error) {
      console.error("Error loading confirmations:", error);
    } finally {
      setLoading(false);
    }
  }

  // Obtener lista plana de todos los que confirmaron
  const allAttendees = confirmations.flatMap((conf) => {
    const attending = conf.attendees.filter((a) => a.attending);
    const special = conf.specialCompanion?.attending
      ? [conf.specialCompanion]
      : [];
    return [...attending, ...special].map((a) => ({
      name: a.name,
      groupName: conf.mainGuestName,
      timestamp: conf.timestamp,
    }));
  });

  const filteredAttendees = allAttendees.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalConfirmed = confirmations.filter((c) => !c.allDeclined).length;
  const totalAttending = allAttendees.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-cyan-400 animate-pulse">
          Cargando confirmaciones...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
          <div className="text-cyan-400 text-sm mb-1">Grupos Confirmados</div>
          <div className="text-3xl font-bold text-white">{totalConfirmed}</div>
        </div>
        <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
          <div className="text-pink-400 text-sm mb-1">Total Asistentes</div>
          <div className="text-3xl font-bold text-white">{totalAttending}</div>
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Lista de Asistentes */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                  #
                </th>
                <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                  Grupo
                </th>
                <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAttendees.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No hay confirmaciones aún
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((attendee, index) => (
                  <motion.tr
                    key={`${attendee.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-800/20"
                  >
                    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">
                      {attendee.name}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {attendee.groupName}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(attendee.timestamp).toLocaleDateString("es-CL")}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-gray-500 text-sm text-center">
        💝 Esta lista no incluye información de regalos ni RUT por privacidad
      </div>
    </div>
  );
}
