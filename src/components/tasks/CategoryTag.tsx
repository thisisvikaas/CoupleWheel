interface CategoryTagProps {
  category?: string;
}

export default function CategoryTag({ category }: CategoryTagProps) {
  if (!category) return null;

  // Generate a consistent color based on category name
  const getColorClass = (cat: string) => {
    const colors = [
      'bg-blue-600/30 text-blue-400 border-blue-500/30',
      'bg-green-600/30 text-green-400 border-green-500/30',
      'bg-yellow-600/30 text-yellow-400 border-yellow-500/30',
      'bg-red-600/30 text-red-400 border-red-500/30',
      'bg-purple-600/30 text-purple-400 border-purple-500/30',
      'bg-pink-600/30 text-pink-400 border-pink-500/30',
      'bg-cyan-600/30 text-cyan-400 border-cyan-500/30',
    ];
    const hash = cat.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold border ${getColorClass(
        category
      )}`}
    >
      🏷️ {category}
    </span>
  );
}
