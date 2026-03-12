import React, { useEffect, useRef, useCallback } from 'react';
import { useUpsellChat } from './UpsellChatContext';
import { UpsellSkeletonDashboard } from './UpsellSkeletonDashboard';
import { UpsellRulesView } from './UpsellRulesView';
import type { BuildStep } from './UpsellChatContext';

const BUILD_STEPS_DATA = [
  { id: '1', message: 'Creating dashboard page structure...' },
  { id: '2', message: 'Generating CMS collection for suggestion rules...' },
  { id: '3', message: 'Defining data schema...' },
  { id: '4', message: 'Searching Wix API documentation for cart events...' },
  { id: '5', message: 'Implementing add-to-cart listener...' },
  { id: '6', message: 'Connecting site widget to CMS...' },
  { id: '7', message: 'Generating approval logic (manual / automatic)...' },
  { id: '8', message: 'Finalizing UI components...' },
];

interface UpsellBuildViewProps {
  onBack: () => void;
  onBuildComplete: () => void;
}

export function UpsellBuildView({ onBack, onBuildComplete }: UpsellBuildViewProps) {
  const { setBuildSteps, setBuildDone, buildDone, setAppBuilt } = useUpsellChat();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(-1);
  const stepsRef = useRef<BuildStep[]>(
    BUILD_STEPS_DATA.map(step => ({ ...step, status: 'pending' as const })),
  );
  const showRulesRef = useRef(false);
  const [showRules, setShowRulesLocal] = React.useState(false);

  const processNextStep = useCallback(() => {
    const idx = currentIndexRef.current;

    if (idx >= BUILD_STEPS_DATA.length) return;

    // Complete the current step
    if (idx >= 0) {
      stepsRef.current = stepsRef.current.map((step, i) =>
        i === idx ? { ...step, status: 'completed' as const } : step,
      );
      setBuildSteps([...stepsRef.current]);
    }

    const nextIdx = idx + 1;
    if (nextIdx < BUILD_STEPS_DATA.length) {
      timerRef.current = setTimeout(() => {
        currentIndexRef.current = nextIdx;
        stepsRef.current = stepsRef.current.map((step, i) =>
          i === nextIdx ? { ...step, status: 'active' as const } : step,
        );
        setBuildSteps([...stepsRef.current]);

        timerRef.current = setTimeout(() => {
          processNextStep();
        }, Math.random() * 1000 + 1500);
      }, idx < 0 ? 500 : 300);
    } else {
      // All steps done
      setBuildDone(true);
    }
  }, [setBuildSteps, setBuildDone]);

  // Kick off build
  useEffect(() => {
    stepsRef.current = BUILD_STEPS_DATA.map(step => ({ ...step, status: 'pending' as const }));
    setBuildSteps(stepsRef.current);
    processNextStep();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Transition from skeleton to rules after build completes
  useEffect(() => {
    if (buildDone && !showRulesRef.current) {
      const timer = setTimeout(() => {
        showRulesRef.current = true;
        setShowRulesLocal(true);
        setAppBuilt(true);
        onBuildComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [buildDone, setAppBuilt, onBuildComplete]);

  if (showRules) {
    return <UpsellRulesView onBack={onBack} />;
  }

  return <UpsellSkeletonDashboard />;
}
