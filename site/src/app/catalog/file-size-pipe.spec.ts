import { FileSizePipe } from './file-size-pipe';

describe('FileSizePipe', () => {
  const pipe = new FileSizePipe();

  it('keeps small sizes in bytes', () => {
    expect(pipe.transform(0)).toBe('0 B');
    expect(pipe.transform(1023)).toBe('1023 B');
  });

  it('scales to the largest fitting unit', () => {
    expect(pipe.transform(1024)).toBe('1.0 KB');
    expect(pipe.transform(48_000_000)).toBe('45.8 MB');
    expect(pipe.transform(3 * 1024 ** 3)).toBe('3.0 GB');
  });
});
