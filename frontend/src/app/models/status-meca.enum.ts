export enum StatusMeca {
    ZAKAZAN = 'ZAKAZAN',
    U_TIJEKU = 'U_TIJEKU',
    ZAVRSEN = 'ZAVRSEN',
    OTKAZAN = 'OTKAZAN'
}

// For displaying in the UI
export const StatusMecaLabels = {
    [StatusMeca.ZAKAZAN]: 'Zakazan',
    [StatusMeca.U_TIJEKU]: 'U tijeku',
    [StatusMeca.ZAVRSEN]: 'Završen',
    [StatusMeca.OTKAZAN]: 'Otkazan'
};
