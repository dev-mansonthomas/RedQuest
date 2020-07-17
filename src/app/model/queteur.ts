export class Queteur {
    public badges: any;
    constructor(
        public last_name: string,
        public first_name: string,
        public man: number,
        public birthdate: string,
        public email: string,
        public mobile: string,
        public secteur: number,
        public nivol: string,
        public ul_registration_token: string,
        public queteur_id: number,
        public registration_approved: boolean,
        public reject_reason: string,
        public queteur_registration_token: string,
        public ul_id: number,
        public rqAutonomousDepartAndReturn: boolean
    ) {
    }

    static aQueteur(): Queteur {
        return new Queteur(
            '',
            '',
            1,
            '',
            '',
            '',
            3,
            '',
            '',
            0,
            null,
            '',
            '',
            0,
            false
        );
    }
}
