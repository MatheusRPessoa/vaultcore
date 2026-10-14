import { CustomerType } from "../domain/customer";

export function normalizeDocument(document: string): string {
    return document.replace(/\D/g, '');
}

export function isValidCpf(cpf: string): boolean {
    if (!/^\d{11}$/.test(cpf)) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    const calculateDigit = (length: number): number => {
        let sum = 0;

        for (let i = 0; i < length; i++) {
            sum += Number(cpf[i]) * (length + 1 - i);
        }

        const remainder = (sum * 10) % 11;
        return remainder === 10 ? 0 : remainder
    };

    return (
        calculateDigit(9) == Number(cpf[9]) &&
        calculateDigit(10) == Number(cpf[10])
    );
}

export function isValidCnpj(cnpj: string): boolean {
    if (!/^\d{14}$/.test(cnpj)) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    const calculateDigit = (length: number): number => {
        const weights =
        length === 12
            ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        const sum = weights.reduce(
        (acc, weight, index) =>
            acc + Number(cnpj[index]) * weight,
        0,
        );

        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };
    return (
        calculateDigit(12) === Number(cnpj[12]) &&
        calculateDigit(13) === Number(cnpj[13])
    );
}

export function isValidDocument(
    document: string,
    type: CustomerType,
): boolean {
    const normalized = normalizeDocument(document);

    if (type === CustomerType.INDIVIDUAL) {
        return isValidCpf(normalized);
    }

    if (type === CustomerType.BUSINESS) {
        return isValidCnpj(normalized);
    }

    return false;
}