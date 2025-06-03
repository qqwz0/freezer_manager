import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function useQrScanner({ onScanSuccess, onScanError }) {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const qrScannerRef = useRef(null);
  const qrContainerId = 'qr-reader-container';

  // Тепер ми просто повідомляємо про результат декодування,
  // але НЕ виконуємо clear() тут.
  const handleSuccess = useCallback(
    (decodedText) => {
      if (!decodedText) return;
      setScanResult(decodedText);
      onScanSuccess?.(decodedText);
      // НЕ кличемо qrScannerRef.current.clear() тут
    },
    [onScanSuccess]
  );

  const handleError = useCallback(
    (errorMessage) => {
      if (
        errorMessage.includes('NotFoundException') ||
        errorMessage.includes('IndexSizeError')
      ) {
        return;
      }
      setScanError(errorMessage);
      if (onScanError) onScanError(errorMessage);
    },
    [onScanError]
  );

  useEffect(() => {
    if (!showScanner) {
      // Якщо showScanner = false, очищаємо існуючий екземпляр
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch((e) => {
          console.warn('Failed to clear QR scanner:', e);
        });
        qrScannerRef.current = null;
      }
      return;
    }

    // Ініціалізуємо сканер тільки коли showScanner = true
    const initTimer = setTimeout(() => {
      const container = document.getElementById(qrContainerId);
      if (!container) {
        setScanError('QR container not found');
        return;
      }
      if (!qrScannerRef.current) {
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        const verbose = false;
        const scanner = new Html5QrcodeScanner(qrContainerId, config, verbose);
        scanner.render(handleSuccess, handleError);
        qrScannerRef.current = scanner;
      }
    }, 300);

    return () => {
      clearTimeout(initTimer);
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch((e) => {
          console.warn('Cleanup: Failed to clear QR scanner:', e);
        });
        qrScannerRef.current = null;
      }
    };
  }, [showScanner, handleSuccess, handleError]);

  const openScanner = () => {
    setScanError(null);
    setScanResult('');
    setShowScanner(true);
  };

  const closeScanner = () => {
    setShowScanner(false);
    setScanError(null);
    setScanResult('');
  };

  return {
    showScanner,
    openScanner,
    closeScanner,
    scanResult,
    scanError,
    qrContainerId,
  };
}

export default useQrScanner;
