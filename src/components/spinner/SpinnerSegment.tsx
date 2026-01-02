import { Task } from '@/types';

interface SpinnerSegmentProps {
  task: Task | null;
  index: number;
  isRevealed: boolean;
  isLanded: boolean;
}

export default function SpinnerSegment({
  task,
  index,
  isRevealed,
  isLanded,
}: SpinnerSegmentProps) {
  const colors = [
    'bg-purple-400',
    'bg-pink-400',
    'bg-blue-400',
    'bg-green-400',
    'bg-yellow-400',
    'bg-red-400',
  ];

  const color = colors[index % colors.length];

  return (
    <div
      className={`h-16 flex items-center justify-center border-2 border-white rounded-lg transition-all ${color} ${
        isLanded ? 'ring-4 ring-yellow-400 scale-105' : ''
      }`}
    >
      {isRevealed && task ? (
        <p className="text-white font-medium text-sm px-2 text-center line-clamp-2">
          {task.text}
        </p>
      ) : (
        <span className="text-white font-bold text-2xl">{index + 1}</span>
      )}
    </div>
  );
}

