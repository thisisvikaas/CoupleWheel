interface CategoryTagProps {
  category?: string;
}

export default function CategoryTag({ category }: CategoryTagProps) {
  if (!category) return null;

  // Generate a consistent color based on category name
  const getColorClass = (cat: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-red-100 text-red-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
    ];
    const hash = cat.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getColorClass(
        category
      )}`}
    >
      {category}
    </span>
  );
}

