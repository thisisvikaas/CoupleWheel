import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { spinService } from '@/services/spinService';
import { taskService } from '@/services/taskService';
import { isItSunday, isSundayAfter11PM } from '@/utils/dateUtils';
import { SundayState, Task, WeeklySpin } from '@/types';
import CountdownTimer from '@/components/countdown/CountdownTimer';
import SpinnerWheel from '@/components/spinner/SpinnerWheel';
import VerificationPanel from '@/components/verification/VerificationPanel';

export default function Dashboard() {
  const { user, partner } = useAuthStore();
  const [sundayState, setSundayState] = useState<SundayState | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousSpin, setPreviousSpin] = useState<WeeklySpin | null>(null);
  const [spinnerTasks, setSpinnerTasks] = useState<Task[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && partner) {
      checkSundayState();
    }
  }, [user, partner]);

  const checkSundayState = async () => {
    if (!user || !partner) return;

    setLoading(true);
    setError('');

    try {
      const isSunday = isItSunday();

      if (!isSunday) {
        // Not Sunday - show countdown
        setSundayState(null);
        setLoading(false);
        return;
      }

      const isAfter11PM = isSundayAfter11PM();

      if (isAfter11PM) {
        // After 11 PM - check if spin exists
        const { spin } = await spinService.getCurrentWeekSpin(user.id);

        if (spin) {
          // Already spun
          setSundayState(SundayState.SPIN_COMPLETE);
        } else {
          // Ready to spin
          setSundayState(SundayState.READY_TO_SPIN);
        }
      } else {
        // Before 11 PM - check verification
        const { spin: prevSpin } = await spinService.getPreviousWeekSpin(user.id);

        if (!prevSpin) {
          // No previous week - ready to spin
          setSundayState(SundayState.READY_TO_SPIN);
        } else {
          setPreviousSpin(prevSpin);
          const isUserA = prevSpin.user_a_id === user.id;
          const hasVerified = isUserA
            ? prevSpin.user_a_verified_by_partner !== null
            : prevSpin.user_b_verified_by_partner !== null;
          const partnerHasVerified = isUserA
            ? prevSpin.user_b_verified_by_partner !== null
            : prevSpin.user_a_verified_by_partner !== null;

          if (hasVerified && partnerHasVerified) {
            setSundayState(SundayState.VERIFICATION_COMPLETE);
          } else {
            setSundayState(SundayState.VERIFICATION_PENDING);
          }
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async () => {
    if (!partner) return;

    setLoading(true);
    setError('');

    try {
      const { tasks, error: tasksError } = await spinService.selectRandomTasksForSpin(
        partner.id
      );

      if (tasksError) throw tasksError;

      setSpinnerTasks(tasks);
      setIsRevealed(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSpinComplete = async (task: Task) => {
    if (!user || !partner) return;

    setLoading(true);
    setError('');

    try {
      // Create or update weekly spin
      const { spin: existingSpin } = await spinService.getCurrentWeekSpin(user.id);

      if (existingSpin) {
        // Update existing spin
        const isUserA = existingSpin.user_a_id === user.id;
        await spinService.updateSpinWithTask(existingSpin.id, user.id, task.id, isUserA);
      } else {
        // Create new spin (both users spinning)
        // For now, just create with partner's task ID as placeholder
        // They will update when they spin
        await spinService.createWeeklySpin(user.id, partner.id, task.id, task.id);
      }

      setSundayState(SundayState.SPIN_COMPLETE);
      checkSundayState();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !sundayState) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-700">{error}</p>
          <button onClick={checkSundayState} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Not Sunday - show countdown and current week
  if (!sundayState) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user?.name}! 💑
          </h1>
          <p className="text-gray-600">
            {partner
              ? `You're paired with ${partner.name}`
              : 'Set up your partner to get started'}
          </p>
        </div>

        <CountdownTimer />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link to="/current" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">Current Week</h3>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-gray-600">View your active task assignment</p>
          </Link>

          <Link to="/tasks" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold">Task Pool</h3>
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-gray-600">Manage tasks for your partner</p>
          </Link>
        </div>

        {!partner && (
          <div className="card bg-yellow-50 border border-yellow-300 mt-8">
            <h3 className="font-semibold mb-2">⚠️ No Partner Linked</h3>
            <p className="text-sm text-gray-700">
              You need to link with your partner to use the app. Make sure they sign up
              using your email, or contact support.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Sunday - Verification Pending
  if (sundayState === SundayState.VERIFICATION_PENDING && previousSpin) {
    const isUserA = previousSpin.user_a_id === user?.id;
    const myTaskId = isUserA ? previousSpin.user_a_task_id : previousSpin.user_b_task_id;
    const partnerTaskId = isUserA
      ? previousSpin.user_b_task_id
      : previousSpin.user_a_task_id;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sunday Verification</h1>
          <p className="text-gray-600">Verify last week's tasks before spinning tonight!</p>
        </div>

        {/* We need to fetch the actual tasks */}
        <VerificationFetcher
          myTaskId={myTaskId}
          partnerTaskId={partnerTaskId}
          spin={previousSpin}
          userId={user?.id || ''}
          partnerName={partner?.name || 'Partner'}
          onComplete={checkSundayState}
        />
      </div>
    );
  }

  // Sunday - Verification Complete
  if (sundayState === SundayState.VERIFICATION_COMPLETE) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">All Set!</h2>
          <p className="text-gray-600 mb-4">
            Both of you have verified last week's tasks. The spinner will be available at
            11:00 PM tonight!
          </p>
          <CountdownTimer />
        </div>
      </div>
    );
  }

  // Sunday - Ready to Spin
  if (sundayState === SundayState.READY_TO_SPIN) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Time to Spin! 🎡
          </h1>
          <p className="text-gray-600">Reveal 6 random tasks and spin the wheel</p>
        </div>

        <SpinnerWheel
          tasks={spinnerTasks}
          onReveal={handleReveal}
          onSpinComplete={handleSpinComplete}
          isRevealed={isRevealed}
          loading={loading}
        />
      </div>
    );
  }

  // Sunday - Spin Complete
  if (sundayState === SundayState.SPIN_COMPLETE) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Spin Complete!</h2>
          <p className="text-gray-600 mb-6">
            You've spun the wheel for this week. Check out your new task!
          </p>
          <Link to="/current" className="btn-primary inline-block">
            View This Week's Task
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

// Helper component to fetch and display verification panel
function VerificationFetcher({
  myTaskId,
  partnerTaskId,
  spin,
  userId,
  partnerName,
  onComplete,
}: {
  myTaskId: string;
  partnerTaskId: string;
  spin: WeeklySpin;
  userId: string;
  partnerName: string;
  onComplete: () => void;
}) {
  const [tasks, setTasks] = useState<{ myTask: Task | null; partnerTask: Task | null }>({
    myTask: null,
    partnerTask: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const { tasks: fetchedTasks } = await taskService.getTasksByIds([
        myTaskId,
        partnerTaskId,
      ]);

      setTasks({
        myTask: fetchedTasks.find((t) => t.id === myTaskId) || null,
        partnerTask: fetchedTasks.find((t) => t.id === partnerTaskId) || null,
      });
      setLoading(false);
    };

    fetchTasks();
  }, [myTaskId, partnerTaskId]);

  if (loading || !tasks.myTask || !tasks.partnerTask) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <VerificationPanel
      spin={spin}
      userId={userId}
      userTask={tasks.myTask}
      partnerTask={tasks.partnerTask}
      partnerName={partnerName}
      onVerificationComplete={onComplete}
    />
  );
}

