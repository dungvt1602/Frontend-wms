"use client";

import { useState, useCallback } from "react";
import ConfirmModal, { ConfirmConfig } from "@/components/ui/ConfirmModal";

interface InternalConfig extends ConfirmConfig {
  resolve: (value: boolean) => void;
}

/**
 * useConfirm — hiện popup xác nhận và trả về Promise<boolean>
 *
 * Usage:
 *   const { confirm, modal } = useConfirm();
 *
 *   async function handleDelete() {
 *     const ok = await confirm({ title: "Xoá?", variant: "danger" });
 *     if (!ok) return;
 *     // proceed
 *   }
 *
 *   return <>{modal} ... rest of JSX</>;
 */
export function useConfirm() {
  const [cfg, setCfg] = useState<InternalConfig | null>(null);

  const confirm = useCallback((config: ConfirmConfig): Promise<boolean> => {
    return new Promise((resolve) => {
      setCfg({ ...config, resolve });
    });
  }, []);

  const handleConfirm = () => {
    cfg?.resolve(true);
    setCfg(null);
  };

  const handleCancel = () => {
    cfg?.resolve(false);
    setCfg(null);
  };

  const modal = cfg ? (
    <ConfirmModal
      open
      {...cfg}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { confirm, modal };
}
