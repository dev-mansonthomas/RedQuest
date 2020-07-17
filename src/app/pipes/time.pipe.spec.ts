import {TimePipe} from './time.pipe';

fdescribe('TimePipe', () => {
    const pipe = new TimePipe();
    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('less than an hour returns only minutes ', () => {
        expect(pipe.transform(51)).toBe(' 51 minutes');
    });

    it('one hour and minutes, returns hour and minutes', () => {
        expect(pipe.transform(91)).toBe('1 heure 31 minutes');
    });

    it('several hours and minutes, returns hours and minutes', () => {
        expect(pipe.transform(339)).toBe('5 heures 39 minutes');
    });

    it('several hours and 0 minutes, returns hours', () => {
        expect(pipe.transform(120)).toBe('2 heures');
    });

    it('small, less than an hour returns only min ', () => {
        expect(pipe.transform(51, {small: true})).toBe('51min');
    });

    it('small, one hour and minutes, returns h and min', () => {
        expect(pipe.transform(91, {small: true})).toBe('1h31min');
    });

    it('small, several hours and minutes, returns h and min', () => {
        expect(pipe.transform(339, {small: true})).toBe('5h39min');
    });

    it('small, several hours and 0 minutes, returns h', () => {
        expect(pipe.transform(120, {small: true})).toBe('2h');
    });

});
