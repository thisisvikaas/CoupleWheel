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
    // Don't wait for partner - show dashboard anyway
    if (user) {
      if (partner) {
        checkSundayState();
      } else {
        // No partner linked - just stop loading
        setLoading(false);
      }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-yellow-500/30 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-t-yellow-400 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 text-yellow-400 font-bold text-lg animate-pulse">Loading Casino...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-neon">
          <p className="text-red-400 text-center">{error}</p>
          <button onClick={checkSundayState} className="btn-primary mt-4 mx-auto block">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No partner linked - show warning
  if (!partner) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            <span className="neon-text">🎰 COUPLES CASINO 🎰</span>
          </h1>
          <p className="text-xl text-purple-300">
            Welcome, <span className="text-yellow-400 font-bold">{user?.name}</span>! 
          </p>
        </div>

        <div className="card-gold text-center animate-pulse-glow">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-yellow-400 glow-gold mb-4">
            Partner Not Linked Yet!
          </h2>
          <p className="text-gray-300 mb-6">
            Your partner needs to sign up using your email address to link your accounts.
            <br />Once linked, you can start playing the challenge wheel together!
          </p>
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-400 mb-2">Share this with your partner:</p>
            <p className="text-yellow-400 font-mono">{user?.email}</p>
          </div>
          <Link to="/tasks" className="btn-primary inline-block">
            🎯 Create Tasks While You Wait
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link to="/tasks" className="card-neon hover:scale-105 transition-transform block">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-yellow-400">🎯 Task Pool</h3>
              <span className="text-4xl">📝</span>
            </div>
            <p className="text-gray-400">Create challenges for your partner</p>
          </Link>

          <div className="card opacity-50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-500">🔒 Current Week</h3>
              <span className="text-4xl">🎡</span>
            </div>
            <p className="text-gray-600">Link your partner to unlock</p>
          </div>
        </div>
      </div>
    );
  }

  // Not Sunday - show countdown and current week
  if (!sundayState) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4">
            <span className="neon-text">🎰 COUPLES CASINO 🎰</span>
          </h1>
          <p className="text-xl text-purple-300">
            Welcome back, <span className="text-yellow-400 font-bold">{user?.name}</span>! 
          </p>
          <p className="text-purple-400">
            Playing with <span className="text-pink-400 font-bold">{partner?.name}</span> 💕
          </p>
        </div>

        <CountdownTimer />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link to="/current" className="card-neon hover:scale-105 transition-transform group block">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-yellow-400 group-hover:glow-gold">🎯 Current Challenge</h3>
              <span className="text-4xl animate-float">🎪</span>
            </div>
            <p className="text-gray-400">View your active mission</p>
          </Link>

          <Link to="/tasks" className="card-neon hover:scale-105 transition-transform group block">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-pink-400 group-hover:glow-purple">📝 Task Pool</h3>
              <span className="text-4xl animate-float" style={{animationDelay: '0.5s'}}>🎲</span>
            </div>
            <p className="text-gray-400">Create challenges for {partner?.name}</p>
          </Link>
        </div>

        <div className="card mt-8 text-center">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">🎰 How To Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-gray-300">Create fun challenges</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-3xl mb-2">🎡</div>
              <p className="text-gray-300">Spin Sunday @ 11PM</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-gray-300">Complete your task</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-gray-300">Verify & celebrate!</p>
            </div>
          </div>
        </div>
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black neon-text mb-2">⚡ VERIFICATION TIME ⚡</h1>
          <p className="text-purple-300">Did your partner complete their challenge?</p>
        </div>

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
        <div className="card-gold text-center animate-pulse-glow">
          <div className="text-6xl mb-4 animate-float">✅</div>
          <h2 className="text-2xl font-bold text-yellow-400 glow-gold mb-4">
            All Verified!
          </h2>
          <p className="text-gray-300 mb-6">
            The wheel unlocks at <span className="text-yellow-400 font-bold">11:00 PM</span> tonight!
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
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-4">
            <span className="neon-text animate-pulse">🎰 SPIN TIME! 🎰</span>
          </h1>
          <p className="text-xl text-purple-300">Your fate awaits...</p>
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
        <div className="card-gold text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-yellow-400 glow-gold mb-4">
            JACKPOT!
          </h2>
          <p className="text-gray-300 mb-6">
            Your challenge has been set! Time to make it happen.
          </p>
          <Link to="/current" className="btn-primary inline-block">
            🎯 View Your Challenge
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
        <div className="w-16 h-16 border-4 border-t-yellow-400 rounded-full animate-spin"></div>
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
