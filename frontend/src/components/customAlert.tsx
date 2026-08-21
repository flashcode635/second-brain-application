import React from 'react';

interface CustomAlertProps {
    message: string;
    onClose: () => void;
    isVisible: boolean;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0  flex justify-center items-center h-75 w-screen z-50 " >

            <div className="theme-surface p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <h2 className="text-xl font-bold mb-4 text-text-primary">Second Brain App </h2>
                <p className="mb-6 text-text-secondary">{message}</p>
                <button
                    onClick={onClose}
                    className="theme-button-primary w-full py-2 px-4 rounded"
                >
                    OK
                </button>
            </div>
        </div>
    );
};