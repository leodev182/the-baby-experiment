// src/components/BabyShower/BabyShowerAdminPrivate.tsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllConfirmations } from "@/services/babyShowerService";
import type { BabyShowerConfirmation } from "@/types";

export function BabyShowerAdminPrivate() {
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

  // Obtener lista completa con RUT y regalos
  const fullAttendeesList = confirmations.flatMap((conf) => {
    const attending = conf.attendees.filter((a) => a.attending);
    const special = conf.specialCompanion?.attending
      ? [conf.specialCompanion]
      : [];

    return [...attending, ...special].map((a) => ({
      name: a.name,
      rut: a.rut,
      groupName: conf.mainGuestName,
      gifts: conf.gifts,
      timestamp: conf.timestamp,
    }));
  });

  const filteredAttendees = fullAttendeesList.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.rut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export Handlers
  function exportToCSV() {
    const headers = ["Nombre", "RUT", "Grupo", "Regalos", "Fecha"];
    const rows = fullAttendeesList.map((a) => [
      a.name,
      a.rut,
      a.groupName,
      a.gifts.map((g) => `${g.name} (x${g.quantity})`).join("; ") ||
        "Sin regalo",
      new Date(a.timestamp).toLocaleDateString("es-CL"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    downloadFile(csvContent, "confirmaciones-completas.csv", "text/csv");
  }

  function exportToJSON() {
    const data = JSON.stringify(fullAttendeesList, null, 2);
    downloadFile(data, "confirmaciones-completas.json", "application/json");
  }

  function exportSimplePDF() {
    // Para PDF simple usaremos HTML que el usuario puede imprimir como PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Lista de Asistentes - Baby Shower Mateo</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #1e3a8a; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 12px; text-align: left; }
          th { background-color: #1e3a8a; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Lista de Asistentes - Baby Shower Mateo Ignacio</h1>
        <p style="text-align: center; color: #666;">7 de Diciembre de 2025 | Irarrázaval 200</p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre Completo</th>
              <th>RUT</th>
            </tr>
          </thead>
          <tbody>
            ${fullAttendeesList
              .map(
                (a, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${a.name}</td>
                <td>${a.rut}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="footer">
          <p>Total de asistentes: ${fullAttendeesList.length}</p>
          <p>Documento generado el ${new Date().toLocaleDateString("es-CL")}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
  }

  function exportCompletePDF() {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Confirmaciones Completas - Baby Shower Mateo</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #1e3a8a; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #1e3a8a; color: white; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .gifts { font-size: 10px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Confirmaciones Completas - Baby Shower Mateo Ignacio</h1>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Grupo</th>
              <th>Regalos</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            ${fullAttendeesList
              .map(
                (a, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${a.name}</td>
                <td>${a.rut}</td>
                <td>${a.groupName}</td>
                <td class="gifts">${
                  a.gifts
                    .map((g) => `${g.name} (x${g.quantity})`)
                    .join("<br>") || "Sin regalo"
                }</td>
                <td>${new Date(a.timestamp).toLocaleDateString("es-CL")}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
  }

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse text-xl">
          Cargando datos privados...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🔒 Panel Privado - Baby Shower
          </h1>
          <p className="text-white/60">Vista completa con RUT y regalos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
            <div className="text-cyan-400 text-sm mb-1">Total Asistentes</div>
            <div className="text-3xl font-bold text-white">
              {fullAttendeesList.length}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
            <div className="text-pink-400 text-sm mb-1">Grupos Confirmados</div>
            <div className="text-3xl font-bold text-white">
              {confirmations.filter((c) => !c.allDeclined).length}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4">
            <div className="text-purple-400 text-sm mb-1">Regalos Elegidos</div>
            <div className="text-3xl font-bold text-white">
              {confirmations.reduce((acc, c) => acc + c.gifts.length, 0)}
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            📥 Exportar Datos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={exportSimplePDF}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
            >
              PDF Simple (Conserjería)
            </button>
            <button
              onClick={exportCompletePDF}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
            >
              PDF Completo
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
            >
              CSV (Excel)
            </button>
            <button
              onClick={exportToJSON}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-all"
            >
              JSON (Backup)
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre o RUT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                    RUT
                  </th>
                  <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                    Grupo
                  </th>
                  <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                    Regalos
                  </th>
                  <th className="px-4 py-3 text-left text-cyan-400 font-semibold">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredAttendees.map((attendee, index) => (
                  <motion.tr
                    key={`${attendee.name}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-white/5"
                  >
                    <td className="px-4 py-3 text-gray-400">{index + 1}</td>
                    <td className="px-4 py-3 text-white font-medium">
                      {attendee.name}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{attendee.rut}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {attendee.groupName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {attendee.gifts.length > 0 ? (
                        <ul className="space-y-1">
                          {attendee.gifts.map((gift, i) => (
                            <li key={i}>
                              {gift.name}{" "}
                              <span className="text-cyan-400">
                                (x{gift.quantity})
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-600">Sin regalo</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(attendee.timestamp).toLocaleDateString("es-CL")}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
