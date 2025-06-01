import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

console.log(Html5QrcodeScanner)

function useQrScanner({ onScanSuccess, onScanError }) {
    const [showScanner, setShowScanner] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const qrScannerRef = useRef(null);
    const qrContainerId = 'qr-reader-container';

    const handleSuccess = useCallback((decodedText) => {
        if (!decodedText) return;
        setScanResult(decodedText);
        onScanSuccess?.(decodedText);

        if (qrScannerRef.current) {
          qrScannerRef.current.clear().catch((e) => {
          console.warn('Failed to stop QR scanner: ', e);
        });

        qrScannerRef.current = null;
      }
    }, [onScanSuccess]);

    const handleError = useCallback((errorMessage) => {
        if (errorMessage.includes('NotFoundException') || errorMessage.includes('IndexSizeError')) {
          return;
        }
        setScanError(errorMessage);
        if (onScanError) onScanError(errorMessage);
    }, [onScanError]);

    useEffect(() => {
    if (!showScanner) {
      // If turning off, clear any existing scanner instance
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch((e) => {
          console.warn('Failed to clear QR scanner:', e);
        });
        qrScannerRef.current = null;
      }
      return;
    }

    // Відкладена ініціалізація, щоб контейнер точно зʼявився
    const initTimer = setTimeout(() => {
      const container = document.getElementById(qrContainerId);
      if (!container) {
        // Якщо й після 300 мс контейнера немає — вивести помилку
        setScanError('QR container not found');
        return;
      }
      // Якщо сканера ще не створено — створюємо його
      if (!qrScannerRef.current) {
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        const verbose = false;
        const scanner = new Html5QrcodeScanner(qrContainerId, config, verbose);
        scanner.render(handleSuccess, handleError);
        qrScannerRef.current = scanner;
      }
    }, 300); // 300 мс має вистачити, щоб модалка змогла промалюватися

    // Cleanup on unmount
    return () => {
      if (initTimer) clearTimeout(initTimer);
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

  return { showScanner, openScanner, closeScanner, scanResult, scanError, qrContainerId };
}
export default useQrScanner