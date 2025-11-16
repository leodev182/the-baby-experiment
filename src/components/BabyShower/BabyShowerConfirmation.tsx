import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INVITED_GROUPS } from "@/data/invitedGroups";
import {
  getGiftsStock,
  submitBabyShowerConfirmation,
  hasGroupConfirmed,
} from "@/services/babyShowerService";
import type { Attendee, SelectedGift, GiftStock } from "@/types";
import { GiftSelector } from "./GiftSelector";
import { DeclineModal } from "./DeclineModal";

export function BabyShowerConfirmation() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [specialCompanion, setSpecialCompanion] = useState({
    name: "",
    rut: "",
    attending: false,
  });
  const [selectedGifts, setSelectedGifts] = useState<SelectedGift[]>([]);
  const [giftsStock, setGiftsStock] = useState<GiftStock[]>([]);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  const selectedGroup = INVITED_GROUPS.find((g) => g.id === selectedGroupId);

  // Cargar stock de regalos
  useEffect(() => {
    loadGiftsStock();
  }, []);

  async function loadGiftsStock() {
    try {
      const stock = await getGiftsStock();
      setGiftsStock(stock);
    } catch (error) {
      console.error("Error loading gifts stock:", error);
    }
  }

  // Inicializar attendees cuando se selecciona un grupo
  useEffect(() => {
    if (selectedGroup) {
      checkIfAlreadyConfirmed();

      const allGuests = [selectedGroup.mainGuest, ...selectedGroup.companions];
      setAttendees(
        allGuests.map((name) => ({
          name,
          rut: "",
          attending: false,
        }))
      );

      if (selectedGroup.isSpecial) {
        setSpecialCompanion({ name: "", rut: "", attending: false });
      }
    }
  }, [selectedGroupId]);

  async function checkIfAlreadyConfirmed() {
    if (!selectedGroupId) return;
    const confirmed = await hasGroupConfirmed(selectedGroupId);
    setAlreadyConfirmed(confirmed);
  }

  function handleAttendeeChange(
    index: number,
    field: "rut" | "attending",
    value: string | boolean
  ) {
    const updated = [...attendees];
    if (field === "attending") {
      updated[index].attending = value as boolean;
      if (!value) {
        updated[index].rut = ""; // Limpiar RUT si no asiste
      }
    } else {
      updated[index].rut = value as string;
    }
    setAttendees(updated);
  }

  function handleSpecialCompanionChange(
    field: "name" | "rut" | "attending",
    value: string | boolean
  ) {
    setSpecialCompanion((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function validateForm(): string | null {
    if (!selectedGroupId) {
      return "Por favor selecciona tu nombre";
    }

    const anyAttending = attendees.some((a) => a.attending);
    const specialAttending =
      selectedGroup?.isSpecial && specialCompanion.attending;

    if (!anyAttending && !specialAttending) {
      return "Debes marcar al menos una opción de asistencia";
    }

    // Validar RUT obligatorio para los que asisten
    for (const attendee of attendees) {
      if (attendee.attending && !attendee.rut.trim()) {
        return `Por favor ingresa el RUT de ${attendee.name}`;
      }
    }

    if (selectedGroup?.isSpecial && specialCompanion.attending) {
      if (!specialCompanion.name.trim()) {
        return "Por favor ingresa el nombre de tu acompañante";
      }
      if (!specialCompanion.rut.trim()) {
        return "Por favor ingresa el RUT de tu acompañante";
      }
    }

    return null;
  }

  async function handleSubmit() {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const allDeclined =
      attendees.every((a) => !a.attending) &&
      (!selectedGroup?.isSpecial || !specialCompanion.attending);

    if (allDeclined) {
      setShowDeclineModal(true);
      return;
    }

    await submitConfirmation(false);
  }

  async function submitConfirmation(declined: boolean) {
    setIsSubmitting(true);

    try {
      const confirmation = {
        groupId: selectedGroupId,
        mainGuestName: selectedGroup!.mainGuest,
        attendees,
        gifts: declined ? [] : selectedGifts,
        specialCompanion: selectedGroup?.isSpecial
          ? specialCompanion
          : undefined,
        allDeclined: declined,
        timestamp: Date.now(),
      };

      await submitBabyShowerConfirmation(confirmation);

      // Redirigir a success
      window.location.href = "/baby-shower-success";
    } catch (error) {
      console.error("Error submitting confirmation:", error);
      alert(
        "Hubo un error al enviar tu confirmación. Por favor intenta de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (alreadyConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Ya confirmaste tu asistencia
          </h2>
          <p className="text-white/80">
            Tu confirmación ya fue registrada. ¡Nos vemos el 7 de diciembre! 💙
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🍼 Baby Shower
          </h1>
          <p className="text-white/80 text-lg">Mateo Ignacio</p>
          <p className="text-white/60">7 de diciembre de 2025</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
          {/* Select Group */}
          <div className="mb-6">
            <label
              htmlFor="guest-selector"
              className="block text-white font-semibold mb-2"
            >
              Selecciona tu nombre:
            </label>
            <select
              id="guest-selector"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Selecciona --</option>
              {INVITED_GROUPS.map((group) => (
                <option
                  key={group.id}
                  value={group.id}
                  className="text-gray-900"
                >
                  {group.mainGuest}
                </option>
              ))}
            </select>
          </div>

          {/* Attendees List */}
          {selectedGroup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h3 className="text-white font-semibold text-lg mb-4">
                Confirma la asistencia de los invitados:
              </h3>

              {attendees.map((attendee, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-white font-medium">
                      {attendee.name}
                    </span>
                    <input
                      type="text"
                      placeholder="RUT"
                      value={attendee.rut}
                      onChange={(e) =>
                        handleAttendeeChange(index, "rut", e.target.value)
                      }
                      className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/50 w-full md:w-auto"
                      disabled={!attendee.attending}
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        name={`attendee-${index}`}
                        checked={!attendee.attending}
                        onChange={() =>
                          handleAttendeeChange(index, "attending", false)
                        }
                      />
                      No asistiré
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        name={`attendee-${index}`}
                        checked={attendee.attending}
                        onChange={() =>
                          handleAttendeeChange(index, "attending", true)
                        }
                      />
                      Asistiré
                    </label>
                  </div>
                </div>
              ))}

              {/* Special Companion */}
              {selectedGroup.isSpecial && (
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Nombre del acompañante"
                    value={specialCompanion.name}
                    onChange={(e) =>
                      handleSpecialCompanionChange("name", e.target.value)
                    }
                    className="w-full bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/50"
                    disabled={!specialCompanion.attending}
                  />
                  <input
                    type="text"
                    placeholder="RUT del acompañante"
                    value={specialCompanion.rut}
                    onChange={(e) =>
                      handleSpecialCompanionChange("rut", e.target.value)
                    }
                    className="w-full bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/50"
                    disabled={!specialCompanion.attending}
                  />
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        name="special-companion"
                        checked={!specialCompanion.attending}
                        onChange={() =>
                          handleSpecialCompanionChange("attending", false)
                        }
                      />
                      No asistiré
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        name="special-companion"
                        checked={specialCompanion.attending}
                        onChange={() =>
                          handleSpecialCompanionChange("attending", true)
                        }
                      />
                      Asistiré
                    </label>
                  </div>
                </div>
              )}
              {/* Gifts Selector */}
              <GiftSelector
                giftsStock={giftsStock}
                selectedGifts={selectedGifts}
                onGiftsChange={setSelectedGifts}
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Enviando..." : "ENVIAR"}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Decline Modal */}
      <AnimatePresence>
        {showDeclineModal && (
          <DeclineModal
            onClose={() => setShowDeclineModal(false)}
            onConfirm={() => submitConfirmation(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
