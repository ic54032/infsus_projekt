export enum StatusMeca {
    ZAKAZAN = 'ZAKAZAN',
    U_TIJEKU = 'U_TIJEKU',
    ZAVRSEN = 'ZAVRSEN',
    OTKAZAN = 'OTKAZAN'
}

export const StatusMecaLabels = {
    [StatusMeca.ZAKAZAN]: 'Zakazan',
    [StatusMeca.U_TIJEKU]: 'U tijeku',
    [StatusMeca.ZAVRSEN]: 'Završen',
    [StatusMeca.OTKAZAN]: 'Otkazan'
};
