export const status = {
    TEMPORARY_CLOSED: 'Temporary Closed',
    PERMANENTLY_CLOSED: 'Permanently Closed',
    INACTIVE: 'Inactive',
    ACTIVE: 'Active',
    NOT_ACTIVE: 'Not Active',
} as const;

export const storeStatus = {
    [status.TEMPORARY_CLOSED]: {
        badgeClass: 'badge badge-outline-info',
    },
    [status.PERMANENTLY_CLOSED]: {
        badgeClass: 'badge badge-outline-danger',
    },
    [status.INACTIVE]: {
        badgeClass: 'badge badge-outline-dark',
    },
    [status.ACTIVE]: {
        badgeClass: 'badge badge-outline-primary',
    },
    [status.NOT_ACTIVE]: {
        badgeClass: 'badge badge-outline-warning',
    },
};

export const districts = [
    { label: 'KASARAGOD', value: 'Kasaragod' },
    { label: 'KANNUR', value: 'Kannur' },
    { label: 'KOZHIKKODE', value: 'Kozhikkode' },
    { label: 'WAYANAD', value: 'Wayanad' },
    { label: 'MALAPPURAM', value: 'Malappuram' },
    { label: 'THRISSUR', valu: 'Thrissur' },
    { label: 'PALAKKAD', value: 'Palakkad' },
    { label: 'ERNAKULAM', value: 'Ernakulam' },
    { label: 'IDUKKI', value: 'Idukki' },
    { label: 'ALAPPUZHA', value: 'Alappuzha' },
    { label: 'KOTTAYAM', value: 'Kottayam' },
    { label: 'KOLLAM', value: 'Kollam' },
    { label: 'PATHANAMTHITTA', value: 'Pathanamthitta' },
    { label: 'TRIVANDRUM', value: 'Trivandrum' },
];

