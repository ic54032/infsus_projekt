export enum StatusLige {
    NADOLAZECA = 'NADOLAZECA',
    AKTIVNA = 'AKTIVNA',
    ZAVRSENA = 'ZAVRSENA'
}

// For displaying in the UI
export const StatusLigeLabels = {
    [StatusLige.NADOLAZECA]: 'Nadolazeća',
    [StatusLige.AKTIVNA]: 'Aktivna',
    [StatusLige.ZAVRSENA]: 'Završena'
};
