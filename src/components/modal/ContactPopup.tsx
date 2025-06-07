"use client";

import { useState } from 'react';
import { useCart } from '@/app/context/CardContext';
import { handlePhoneChange, validateForm } from './popupMethods';
import { isErrored } from 'stream';
import { IFormErrors } from './interfaces';

export const ContactPopup = ({ onClose }: { onClose: () => void }) => {
    const [isName, setName] = useState('');
    const [isPhone, setPhone] = useState('');
    const [isErrors, setErrors] = useState<IFormErrors>({ name: '', phone: '' });
    const { cart } = useCart();

    const handleSubmit = () => {
        if (validateForm(isName, isPhone, setErrors)) {
            const productsList = cart.map(item => `- ${item.name} (${item.price})`).join('\n');
            const message = `Olá! Sou ${isName} (${isPhone}).\nGostaria de comprar:\n${productsList}`;
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/SEU_NUMERO?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            onClose();
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    ✕
                </button>

                <div className="flex justify-center mb-4">
                    <img src="/imgs/logo-josi-glow.png" alt="Logo Josi Glow" className="h-32 w-32 border-2 border-yellowgreen rounded-full object-cover p-1" />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Seu nome
                        </label>
                        <input
                            type="text"
                            value={isName}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (isErrors.name) setErrors({ ...isErrors, name: '' });
                            }}
                            className={`w-full px-3 py-2 border ${isErrors.name ? 'border-red-500' : 'border-purple-500'} rounded-md text-black placeholder-gray-400`}
                            placeholder="Digite seu nome"
                        />
                        {isErrors.name && <p className="text-red-500 text-xs mt-1">{isErrors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Seu telefone
                        </label>
                        <input
                            type="tel"
                            value={isPhone}
                            onChange={(e) => handlePhoneChange(e, setPhone, isErrored, setErrors)}
                            className={`w-full px-3 py-2 border ${isErrors.phone ? 'border-red-500' : 'border-purple-500'} rounded-md text-black placeholder-gray-400`}
                            placeholder="(00) 00000-0000"
                        />
                        {isErrors.phone && <p className="text-red-500 text-xs mt-1">{isErrors.phone}</p>}
                    </div>

                    <button
                        onClick={() => handleSubmit()}
                        disabled={!isName || !isPhone}
                        className={`w-full py-2 px-4 rounded-md text-white ${(!isName || !isPhone) ? 'bg-purple-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        Enviar pedido via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};