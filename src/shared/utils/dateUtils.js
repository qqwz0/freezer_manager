// import { Timestamp } from 'firebase/firestore';

// export function formatYMD(value) {
//     // якщо нічого немає — повертаємо пустий рядок
//     if (value === null || value === undefined || value === '') {
//         return '';
//     }

//     // отримуємо JS-Date
//     const date = value instanceof Timestamp
//         ? value.toDate()
//         : (value instanceof Date
//             ? value
//             : new Date(value)
//         );

//     // якщо дата некоректна — пустий рядок
//     if (isNaN(date.getTime())) {
//         return '';
//     }

//     // інакше — у форматі YYYY-MM-DD
//     return date.toISOString().split('T')[0];

// }

import { Timestamp } from 'firebase/firestore';

export function formatDMY(value) {
    // якщо нічого немає — повертаємо пустий рядок
    if (value === null || value === undefined || value === '') {
        return '';
    }

    // отримуємо JS-Date
    const date = value instanceof Timestamp
        ? value.toDate()
        : (value instanceof Date
            ? value
            : new Date(value)
        );

    // якщо дата некоректна — пустий рядок
    if (isNaN(date.getTime())) {
        return '';
    }

    // формат dd/mm/yyyy
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // місяці з 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const parseDMY = (str) => {
    if (!str) return undefined;
    const parts = str.includes('.') ? str.split('.') : str.split('/');
    if (parts.length !== 3) return undefined;
    const [day, month, year] = parts.map(Number);
    return new Date(year, month - 1, day);
};