import {WeightPipe} from './weight.pipe';

fdescribe('WeightPipe', () => {
  const pipe = new WeightPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('providing no value returns fallback', () => {
    expect(pipe.transform(559.1, )).toBe('0.56 kg');
  });

  it('providing no value returns fallback', () => {
    expect(pipe.transform(1899.66, )).toBe('1.90 kg');
  });

  it('providing no value returns fallback', () => {
    expect(pipe.transform(1692.26, )).toBe('1.69 kg');
  });
});
