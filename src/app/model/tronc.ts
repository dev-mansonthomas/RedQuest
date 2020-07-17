
export class Tronc {
    constructor(
        public tronc_queteur_id: number,
        public queteur_id: number,
        public point_quete_id: number,
        public tronc_id: number,
        public depart_theorique: Date,
        public depart: Date,
        public arrivee: Date,
        public name: string,
        public latitude: number,
        public longitude: number,
        public address: string,
        public postal_code: string,
        public city: string,
        public advice: string,
        public localization: string
    ) { }

    public static aTronc(): Tronc {
        return new Tronc(0, 0, 0, 0, new Date(), new Date(), new Date(), '', 0, 0, '', '', '', '', '');
    }
}
