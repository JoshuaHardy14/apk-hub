import { noteLines } from './release-notes';

describe('noteLines', () => {
  it('strips list markers and blank lines', () => {
    expect(noteLines('- New boss\n\n* Faster loading\n• Bug fixes\nPlain line')).toEqual([
      'New boss',
      'Faster loading',
      'Bug fixes',
      'Plain line',
    ]);
  });

  it('returns nothing for empty notes', () => {
    expect(noteLines('  \n ')).toEqual([]);
  });
});
