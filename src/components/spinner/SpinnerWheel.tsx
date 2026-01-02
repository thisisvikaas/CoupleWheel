import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/types';
import SpinnerSegment from './SpinnerSegment';
import RevealButton from './RevealButton';

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
      <div className="card max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Sunday Spinner</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <SpinnerSegment
              key={index}
              task={null}
              index={index}
              isRevealed={false}
              isLanded={false}
            />
          ))}
        </div>
        <RevealButton onReveal={onReveal} disabled={false} loading={loading} />
      </div>
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isSpinning
          ? 'Spinning... 🎡'
          : landedIndex !== null
          ? 'Your Task This Week! ✨'
          : 'Spin the Wheel!'}
      </h2>

      <motion.div
        className="grid grid-cols-2 gap-4 mb-6"
        animate={
          isSpinning
            ? {
                scale: [1, 1.05, 1, 1.05, 1],
                rotate: [0, 5, -5, 5, 0],
              }
            : landedIndex !== null
            ? {
                scale: [1, 1.02, 1],
              }
            : {}
        }
        transition={{ duration: isSpinning ? 4 : 0.3, repeat: isSpinning ? Infinity : 0 }}
      >
        {tasks.map((task, index) => (
          <SpinnerSegment
            key={task.id}
            task={task}
            index={index}
            isRevealed={true}
            isLanded={landedIndex === index}
          />
        ))}
      </motion.div>

      {landedIndex === null ? (
        <div className="text-center">
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="btn-primary px-8 py-3 text-lg"
          >
            {isSpinning ? 'Spinning...' : 'Spin! 🎡'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card bg-yellow-50 border-2 border-yellow-300">
            <h3 className="font-semibold text-lg mb-2">Your Challenge:</h3>
            <p className="text-gray-800">{selectedTask?.text}</p>
            {selectedTask?.category && (
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                  {selectedTask.category}
                </span>
              </div>
            )}
          </div>
          <button onClick={handleConfirm} className="btn-primary w-full">
            Confirm Selection ✓
          </button>
        </div>
      )}
    </div>
  );
}

