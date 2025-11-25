import { useEffect, useRef, useState } from "react";

const ProgressCircle: React.FC<{ votes: number; totalGames: number }> = ({
  votes,
  totalGames,
}) => {
  const targetProgress = Math.round((votes / totalGames) * 100);
  const [displayProgress, setDisplayProgress] = useState(targetProgress);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const startProgress = displayProgress;
    const progressDiff = targetProgress - startProgress;

    if (Math.abs(progressDiff) < 0.1) return;

    const duration = 1000;
    let startTime: number | null = null;

    const easeOut = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);

      const currentValue = startProgress + progressDiff * easedProgress;
      setDisplayProgress(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetProgress]);

  // Calculate the stroke-dasharray for the progress
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (displayProgress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        className="-rotate-90 transform"
        width="56"
        height="56"
        viewBox="0 0 40 40"
      >
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-base-300"
        />
        {/* Progress circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-secondary"
        />
      </svg>
      {/* Text overlay */}
      <div className="text-secondary absolute inset-0 flex items-center justify-center text-sm font-semibold">
        {votes}/{totalGames}
      </div>
    </div>
  );
};

export default ProgressCircle;
