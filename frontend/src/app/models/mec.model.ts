export interface Mec {
    id?: number;
    ligaId: number;
    igrac1Id: number;
    igrac2Id: number;
    datum: string;
    vrijeme: string;
    rezultat?: string;
    status: string;
    igrac1Ime?: string;
    igrac2Ime?: string;
}
