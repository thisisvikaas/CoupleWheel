import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/types';

interface SpinnerWheelProps {
  tasks: Task[];
  onReveal: () => Promise<void>;
  onSpinComplete: (task: Task) => void;
  isRevealed: boolean;
  loading: boolean;
}

export default function SpinnerWheel({
  tasks,
  onReveal,
  onSpinComplete,
  isRevealed,
  loading,
}: SpinnerWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const colors = [
    'from-red-500 to-red-600',
    'from-yellow-500 to-amber-500', 
    'from-green-500 to-emerald-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-violet-500',
    'from-pink-500 to-rose-500',
  ];

  const handleSpin = () => {
    if (isSpinning || tasks.length === 0) return;

    setIsSpinning(true);
    setLandedIndex(null);
    setSelectedTask(null);

    // Simulate spin duration
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * tasks.length);
      setLandedIndex(randomIndex);
      setSelectedTask(tasks[randomIndex]);
      setIsSpinning(false);
    }, 4000);
  };

  const handleConfirm = () => {
    if (selectedTask) {
      onSpinComplete(selectedTask);
    }
  };

  if (!isRevealed) {
    return (
      <div className="card-gold max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-black mb-6">
          <span className="neon-text">🎰 THE WHEEL 🎰</span>
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((num, index) => (
            <motion.div
              key={num}
              className={`h-20 flex items-center justify-center rounded-xl bg-gradient-to-br ${colors[index]} border-2 border-white/20`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            >
              <span className="slot-number text-white">{num}</span>
            </motion.div>
          ))}
        </div>

        <button
          onClick={onReveal}
          disabled={loading}
          className="btn-primary text-xl px-12 py-4"
        >
          {loading ? '🔮 Revealing...' : '🎁 REVEAL CHALLENGES'}
        </button>
        <p className="text-sm text-gray-400 mt-4">
          6 random challenges from your partner's pool
        </p>
      </div>
    );
  }

  return (
    <div className="card-gold max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-black mb-6">
        {isSpinning ? (
          <span className="neon-text animate-pulse">🎰 SPINNING... 🎰</span>
        ) : landedIndex !== null ? (
          <span className="text-yellow-400 glow-gold">🏆 YOUR CHALLENGE! 🏆</span>
        ) : (
          <span className="neon-text">🎡 SPIN THE WHEEL! 🎡</span>
        )}
      </h2>

      <motion.div
        className="grid grid-cols-2 gap-4 mb-8"
        animate={
          isSpinning
            ? {
                rotateY: [0, 360],
                scale: [1, 1.1, 1],
              }
            : {}
        }
        transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
      >
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className={`h-24 flex items-center justify-center rounded-xl bg-gradient-to-br ${colors[index]} border-2 p-3
              ${landedIndex === index 
                ? 'border-yellow-400 ring-4 ring-yellow-400/50 scale-110' 
                : 'border-white/20'
              }
            `}
            animate={
              landedIndex === index
                ? { scale: [1, 1.1, 1.05], boxShadow: ['0 0 20px rgba(234,179,8,0.5)', '0 0 40px rgba(234,179,8,0.8)', '0 0 20px rgba(234,179,8,0.5)'] }
                : isSpinning
                ? { opacity: [1, 0.5, 1] }
                : {}
            }
            transition={{ duration: landedIndex === index ? 0.5 : 0.3, repeat: landedIndex === index ? Infinity : 0 }}
          >
            <p className="text-white font-bold text-sm text-center line-clamp-3 drop-shadow-lg">
              {task.text}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {landedIndex === null ? (
        <motion.button
          onClick={handleSpin}
          disabled={isSpinning}
          className="btn-primary text-xl px-12 py-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSpinning ? '🎲 SPINNING...' : '🎰 SPIN!'}
        </motion.button>
      ) : (
        <div className="space-y-4">
          <div className="card bg-gradient-to-r from-yellow-900/50 to-amber-900/50 border-2 border-yellow-500/50">
            <h3 className="font-bold text-yellow-400 text-lg mb-2">🎯 Your Challenge:</h3>
            <p className="text-white text-lg">{selectedTask?.text}</p>
            {selectedTask?.category && (
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-purple-600 text-white">
                  {selectedTask.category}
                </span>
              </div>
            )}
          </div>
          <motion.button 
            onClick={handleConfirm} 
            className="btn-primary w-full text-lg py-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ✅ ACCEPT CHALLENGE
          </motion.button>
        </div>
      )}
    </div>
  );
}
