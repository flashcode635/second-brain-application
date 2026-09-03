import React from 'react';

interface CustomAlertProps {
    message: string;
    link?: string;
    onClose: () => void;
    isVisible: boolean;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ message, link, onClose, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-6 left-4 right-4 z-50 flex justify-start">

            <div className="theme-surface w-full max-w-sm p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-bold mb-4 text-text-primary">Second Brain App </h2>
                <p className="mb-6 text-text-secondary">{message}: {link && <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{link}</a>}</p>
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