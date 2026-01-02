import { Task } from '@/types';

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Group tasks by category
 */
function groupByCategory(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce((acc, task) => {
    const category = task.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
}

/**
 * Distributed random selection across categories
 */
function distributedRandomSelection(
  categorizedTasks: Record<string, Task[]>,
  count: number
): Task[] {
  const categories = Object.keys(categorizedTasks);
  const tasksPerCategory = Math.floor(count / categories.length);
  const remainder = count % categories.length;
  
  let selected: Task[] = [];
  
  categories.forEach((category, index) => {
    const numToSelect = tasksPerCategory + (index < remainder ? 1 : 0);
    const shuffled = shuffleArray(categorizedTasks[category]);
    selected.push(...shuffled.slice(0, numToSelect));
  });
  
  return shuffleArray(selected).slice(0, count);
}

/**
 * Select random tasks with optional category distribution
 */
export function selectRandomTasks(tasks: Task[], count: number = 6): Task[] {
  // Filter out completed tasks
  const available = tasks.filter(t => t.status === 'available');
  
  if (available.length === 0) {
    return [];
  }
  
  // If not enough tasks, return all available
  if (available.length <= count) {
    return shuffleArray(available);
  }
  
  // Group by category
  const categorized = groupByCategory(available);
  
  // If multiple categories exist, distribute across them
  if (Object.keys(categorized).length > 1) {
    return distributedRandomSelection(categorized, count);
  }
  
  // Otherwise, pure random selection
  return shuffleArray(available).slice(0, count);
}

