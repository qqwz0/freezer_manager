import { Timestamp } from 'firebase/firestore';

export function formatYMD(value) {
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

    // інакше — у форматі YYYY-MM-DD
    return date.toISOString().split('T')[0];
}