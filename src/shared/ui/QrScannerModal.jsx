import React from 'react';
import { Modal, Button, ModalHeader, ModalBody } from 'flowbite-react';

function QrScannerModal({
    show,
    onClose,
    scanError,
    scanResult,
    qrContainerId
}) {
    return (
    <Modal show={show} size="md" popup onClose={onClose}>
      <ModalHeader />
      <ModalBody>
        <div className="space-y-4 text-center">
          <h3 className="text-xl font-medium text-white-900">Scan QR Code</h3>
          {scanError && <p className="text-sm text-red-600">Error: {scanError}</p>}

          {/* Container for Html5QrcodeScanner */}
          <div id={qrContainerId} className="w-full" />

          {/* {scanResult && (
            <p className="text-sm text-green-700">
              Scanned: <strong>{scanResult}</strong>
            </p>
          )} */}

          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default QrScannerModal