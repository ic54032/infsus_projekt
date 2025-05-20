export interface Mec {
    id?: number;
    ligaId: number;
    igrac1Id: number;
    igrac2Id: number;
    datum: string;
    vrijeme: string;
    rezultat?: string;
    status: string;
    napomena?: string;
    igrac1Ime?: string;
    igrac2Ime?: string;
}

export interface MecViewModel {
    id?: number;
    ligaId?: number;
    ligaNaziv?: string;
    igrac1: string;
    igrac2: string;
    datum: string;
    rezultat: string;
    status: string;
}
