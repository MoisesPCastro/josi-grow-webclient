import { IFormErrors } from "./interfaces";

export const validateForm = (name: string, phone: string, setErrors: React.Dispatch<React.SetStateAction<IFormErrors>>) => {
    let valid = true;
    const newErrors = { name: '', phone: '' };

    if (name.length < 3) {
        newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
        valid = false;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 11) {
        newErrors.phone = 'Telefone deve ter 11 dígitos (incluindo DDD)';
        valid = false;
    }

    setErrors(newErrors);
    return valid;
};

export const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, setPhone: any, Ierrors: any, setErrors: any) => {
    const value = e.target.value;
    const digits = value.replace(/\D/g, '').substring(0, 11);

    let formatted = '';
    if (digits.length > 0) {
        formatted += `(${digits.substring(0, 2)}`;
    }
    if (digits.length > 2) {
        formatted += `) ${digits.substring(2, 7)}`;
    }
    if (digits.length > 7) {
        formatted += `-${digits.substring(7)}`;
    }

    setPhone(formatted);
    if (Ierrors?.phone) {
        setErrors({ ...Ierrors, phone: '' });
    }
};
