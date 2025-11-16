import { motion } from "framer-motion";
import type { GiftStock, SelectedGift } from "@/types";

interface GiftSelectorProps {
  giftsStock: GiftStock[];
  selectedGifts: SelectedGift[];
  onGiftsChange: (gifts: SelectedGift[]) => void;
}

export function GiftSelector({
  giftsStock,
  selectedGifts,
  onGiftsChange,
}: GiftSelectorProps) {
  function isGiftSelected(giftId: string): boolean {
    return selectedGifts.some((g) => g.id === giftId);
  }

  function getSelectedQuantity(giftId: string): number {
    const gift = selectedGifts.find((g) => g.id === giftId);
    return gift?.quantity || 1;
  }

  function handleGiftToggle(gift: GiftStock) {
    if (isGiftSelected(gift.id)) {
      // Deseleccionar
      onGiftsChange(selectedGifts.filter((g) => g.id !== gift.id));
    } else {
      // Seleccionar con cantidad inicial 1
      onGiftsChange([
        ...selectedGifts,
        {
          id: gift.id,
          name: gift.name,
          quantity: 1,
        },
      ]);
    }
  }

  function handleQuantityChange(giftId: string, quantity: number) {
    onGiftsChange(
      selectedGifts.map((g) => (g.id === giftId ? { ...g, quantity } : g))
    );
  }

  // Filtrar solo regalos disponibles
  const availableGifts = giftsStock.filter((g) => g.currentCount > 0);

  if (availableGifts.length === 0) {
    return (
      <div className="bg-white/5 rounded-lg p-6 text-center">
        <p className="text-white/60">
          Ya no hay regalos disponibles. ¡Gracias por tu interés! 💝
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">Lista de regalos</h3>
        <p className="text-white/60 text-sm">
          (Opcional - Tu presencia es el mejor regalo 💝)
        </p>
      </div>

      <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
        {availableGifts.map((gift) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 rounded-lg p-3 space-y-2"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id={`gift-${gift.id}`}
                checked={isGiftSelected(gift.id)}
                onChange={() => handleGiftToggle(gift)}
                className="mt-1 w-5 h-5 cursor-pointer"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label
                    htmlFor={`gift-${gift.id}`}
                    className="text-white font-medium cursor-pointer"
                  >
                    {gift.name}
                  </label>

                  {!gift.isUnique && (
                    <span className="text-white/60 text-sm">
                      (quedan {gift.currentCount})
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                {isGiftSelected(gift.id) && !gift.isUnique && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <label
                      htmlFor={`quantity-${gift.id}`}
                      className="text-white/80 text-sm block mb-1"
                    >
                      Cantidad:
                    </label>
                    <select
                      id={`quantity-${gift.id}`}
                      value={getSelectedQuantity(gift.id)}
                      onChange={(e) =>
                        handleQuantityChange(gift.id, parseInt(e.target.value))
                      }
                      className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      {Array.from(
                        { length: gift.currentCount },
                        (_, i) => i + 1
                      ).map((n) => (
                        <option key={n} value={n} className="text-gray-900">
                          {n}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedGifts.length > 0 && (
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <p className="text-white font-semibold mb-2">
            Regalos seleccionados: {selectedGifts.length}
          </p>
          <div className="space-y-1 text-sm text-white/80">
            {selectedGifts.map((gift) => (
              <div key={gift.id} className="flex justify-between">
                <span>{gift.name}</span>
                <span>x{gift.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
