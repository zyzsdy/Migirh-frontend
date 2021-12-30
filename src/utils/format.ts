export function formatDateShort(d: Date) {
    return `${d.getMonth() + 1}-${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function formatDateLong(d: Date) {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ` +
        `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
}