// hooks/useModal.js
import { useState, useCallback } from 'react';

export default function useModal() {
  const [config, setConfig] = useState({ mode: null });

  const open = useCallback(cfg => setConfig({ ...cfg, mode: cfg.mode }), []);
  const close = useCallback(() => setConfig({ mode: null }), []);

  return { config, open, close };
}