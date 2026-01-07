"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { useEngagementTracker } from "../hooks/useEngagementTracker";

type ModalSource = "sidebar" | "banner";

interface SponsorshipContextValue {
  // Modal state
  isModalOpen: boolean;
  modalSource: ModalSource | null;
  openModal: (source: ModalSource) => void;
  closeModal: () => void;

  // Engagement tracking
  completionCount: number;
  incrementCompletion: () => void;
  shouldShowBanner: boolean;
  dismissBanner: () => void;
}

const SponsorshipContext = createContext<SponsorshipContextValue | null>(null);

export interface SponsorshipProviderProps {
  children: ReactNode;
}

export function SponsorshipProvider({ children }: SponsorshipProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState<ModalSource | null>(null);

  const { completionCount, incrementCompletion, shouldShowBanner, dismissBanner } =
    useEngagementTracker();

  const openModal = useCallback((source: ModalSource) => {
    setModalSource(source);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Reset source after close animation completes
    setTimeout(() => setModalSource(null), 200);
  }, []);

  const value = useMemo<SponsorshipContextValue>(
    () => ({
      isModalOpen,
      modalSource,
      openModal,
      closeModal,
      completionCount,
      incrementCompletion,
      shouldShowBanner,
      dismissBanner,
    }),
    [
      isModalOpen,
      modalSource,
      openModal,
      closeModal,
      completionCount,
      incrementCompletion,
      shouldShowBanner,
      dismissBanner,
    ]
  );

  return <SponsorshipContext.Provider value={value}>{children}</SponsorshipContext.Provider>;
}

export function useSponsorship(): SponsorshipContextValue {
  const context = useContext(SponsorshipContext);
  if (context === null) {
    throw new Error("useSponsorship must be used within a SponsorshipProvider");
  }
  return context;
}
