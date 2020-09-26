let path = require('path');
const { pack, unpack } = require('../src/index');
describe('Base functions', () => {
  test('Pack', (done) => {
    // should pack the
    const file = 'myfile.tar.gz';

    pack(['src'], file, { force: true });

    expect(require('fs').existsSync(file)).toBe(true);
    done();
  });

  test('Unpack', (done) => {
    // should pack the
    const file = 'myfile.tar.gz';

    unpack(file);

    expect(require('fs').existsSync(file)).toBe(true);
    done();
  });
});
