import { TimePipe } from './time.pipe';

fdescribe('TimePipe', () => {
  const pipe = new TimePipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('providing no value returns fallback', () => {
    expect(pipe.transform(51, )).toBe('51 minutes');
  });

  it('providing no value returns fallback', () => {
    expect(pipe.transform(91, )).toBe('1 heure et 31 minutes');
  });

  it('providing no value returns fallback', () => {
    expect(pipe.transform(339, )).toBe('5 heures et 39 minutes');
  });

});
