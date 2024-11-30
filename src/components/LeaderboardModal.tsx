import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Loader2 } from "lucide-react";
import { LeaderboardEntry, Difficulty } from "@/types/game";
import { getLeaderboard } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDifficulty: Difficulty;
}

const LeaderboardModal = ({ isOpen, onClose, currentDifficulty }: LeaderboardModalProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">(currentDifficulty);

  const { data: scores, isLoading, error } = useQuery({
    queryKey: ['leaderboard', selectedDifficulty],
    queryFn: () => getLeaderboard(selectedDifficulty === "all" ? undefined : selectedDifficulty),
    enabled: isOpen,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏅";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl game-card"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white/80" />
              </button>
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2 mb-6">
              {["all", "easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff as Difficulty | "all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? "bg-primary text-white"
                      : "bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center p-12 text-red-400">
                Une erreur est survenue lors du chargement du classement.
              </div>
            )}

            {/* Scores Table */}
            {scores && !isLoading && (
              <div className="overflow-hidden rounded-lg border border-white/10">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 text-left">
                      <th className="p-4 font-medium text-white/60">#</th>
                      <th className="p-4 font-medium text-white/60">Player</th>
                      <th className="p-4 font-medium text-white/60">Score</th>
                      <th className="p-4 font-medium text-white/60 hidden sm:table-cell">Difficulty</th>
                      <th className="p-4 font-medium text-white/60 hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((entry, index) => (
                      <tr
                        key={index}
                        className="border-t border-white/5 text-white/80 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-mono">
                          {getMedalEmoji(index)}
                        </td>
                        <td className="p-4">{entry.playerName}</td>
                        <td className="p-4 font-mono font-bold text-primary">
                          {entry.score}
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            entry.difficulty === "easy"
                              ? "bg-green-500/20 text-green-400"
                              : entry.difficulty === "medium"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}>
                            {entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-sm hidden sm:table-cell">
                          {formatDate(entry.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeaderboardModal;