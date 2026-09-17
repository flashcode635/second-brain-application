import React from 'react';
import ButtonElement from './button';

interface CustomAlertProps {
    message: string;
    link?: string;
    onClose: () => void;
    isVisible: boolean;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ message, link, onClose, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-16 right-44 z-50 flex justify-start">

            <div className=" border-red-400 border theme-surface  w-full max-w-sm p-6 rounded-lg shadow-xl">
                <h2 className="text-xl font-heading font-bold mb-4 text-text-primary">Oops!! </h2>
                <p className="mb-6 text-red-600">{message} {link && <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">: {link}</a>}</p>
                <ButtonElement size='submit' onClickfn={onClose} text="OK" variant="primary" />
                
            </div>
        </div>
    );
};