import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ChatPhase = 'welcome' | 'conversation';

interface PostBuildMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface BuildStep {
  id: string;
  message: string;
  status: 'pending' | 'active' | 'completed';
}

interface UpsellChatState {
  // Panel visibility
  isUpsellPanelOpen: boolean;
  setIsUpsellPanelOpen: (open: boolean) => void;

  // Chat phase
  phase: ChatPhase;
  setPhase: (phase: ChatPhase) => void;

  // User message (first message that triggers conversation)
  userMessage: string;
  setUserMessage: (msg: string) => void;

  // Blueprint flow
  showBlueprint: boolean;
  setShowBlueprint: (show: boolean) => void;

  // Animation skip flags
  hasStreamed: boolean;
  setHasStreamed: (v: boolean) => void;
  blueprintStreamed: boolean;
  setBlueprintStreamed: (v: boolean) => void;

  // Build state
  appBuilt: boolean;
  setAppBuilt: (v: boolean) => void;
  buildSteps: BuildStep[];
  setBuildSteps: (steps: BuildStep[]) => void;
  buildDone: boolean;
  setBuildDone: (v: boolean) => void;

  // Post-build
  hideCreatedDate: boolean;
  setHideCreatedDate: (v: boolean) => void;
  postBuildMessages: PostBuildMessage[];
  addPostBuildMessage: (msg: PostBuildMessage) => void;

  // Chat input
  chatInputValue: string;
  setChatInputValue: (value: string) => void;

  // Reset
  resetChat: () => void;
}

const UpsellChatContext = createContext<UpsellChatState | null>(null);

export function UpsellChatProvider({ children }: { children: ReactNode }) {
  const [isUpsellPanelOpen, setIsUpsellPanelOpen] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>('welcome');
  const [userMessage, setUserMessage] = useState('');
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [hasStreamed, setHasStreamed] = useState(false);
  const [blueprintStreamed, setBlueprintStreamed] = useState(false);
  const [appBuilt, setAppBuilt] = useState(false);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [buildDone, setBuildDone] = useState(false);
  const [hideCreatedDate, setHideCreatedDate] = useState(false);
  const [postBuildMessages, setPostBuildMessages] = useState<PostBuildMessage[]>([]);
  const [chatInputValue, setChatInputValue] = useState('');

  const addPostBuildMessage = useCallback((msg: PostBuildMessage) => {
    setPostBuildMessages(prev => [...prev, msg]);
  }, []);

  const resetChat = useCallback(() => {
    setPhase('welcome');
    setUserMessage('');
    setShowBlueprint(false);
    setHasStreamed(false);
    setBlueprintStreamed(false);
    setAppBuilt(false);
    setBuildSteps([]);
    setBuildDone(false);
    setHideCreatedDate(false);
    setPostBuildMessages([]);
    setChatInputValue('');
  }, []);

  return (
    <UpsellChatContext.Provider
      value={{
        isUpsellPanelOpen,
        setIsUpsellPanelOpen,
        phase,
        setPhase,
        userMessage,
        setUserMessage,
        showBlueprint,
        setShowBlueprint,
        hasStreamed,
        setHasStreamed,
        blueprintStreamed,
        setBlueprintStreamed,
        appBuilt,
        setAppBuilt,
        buildSteps,
        setBuildSteps,
        buildDone,
        setBuildDone,
        hideCreatedDate,
        setHideCreatedDate,
        postBuildMessages,
        addPostBuildMessage,
        chatInputValue,
        setChatInputValue,
        resetChat,
      }}
    >
      {children}
    </UpsellChatContext.Provider>
  );
}

export function useUpsellChat() {
  const ctx = useContext(UpsellChatContext);
  if (!ctx) throw new Error('useUpsellChat must be used within UpsellChatProvider');
  return ctx;
}
