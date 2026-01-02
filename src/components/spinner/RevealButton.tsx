interface RevealButtonProps {
  onReveal: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function RevealButton({ onReveal, disabled, loading }: RevealButtonProps) {
  return (
    <div className="text-center">
      <button
        onClick={onReveal}
        disabled={disabled || loading}
        className="btn-primary px-8 py-3 text-lg"
      >
        {loading ? 'Loading Tasks...' : 'Reveal Tasks 🎁'}
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Click to see 6 random tasks from your partner's pool
      </p>
    </div>
  );
}

