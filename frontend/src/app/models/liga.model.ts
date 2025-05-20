export interface Liga {
    id?: number;
    naziv: string;
    status: string;
    datumPocetka: string | null;
    datumZavrsetka?: string | null;
    format: string;
    max_igraca: number;
}
