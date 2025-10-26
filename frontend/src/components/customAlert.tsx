import React from 'react';

interface CustomAlertProps {
    message: string;
    onClose: () => void;
    isVisible: boolean;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0  flex justify-center items-center h-[300px] w-[100vw] z-50 " >

            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                <h2 className="text-xl font-bold mb-4 text-red-700">Second Brain App Error </h2>
                <p className="mb-6 text-gray-600">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-purple-750 text-white py-2 px-4
                     rounded hover:bg-purple-850"
                >
                    OK
                </button>
            </div>
        </div>
    );
};