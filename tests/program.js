const { pack, unpack } = require('../src/');

const file = 'mypackXX1.tar.gz';
const whatToPack = ['G:\\111222333', 'G:/5/1234'];
console.log(`what to pack: ${whatToPack.join(', ')}`);

console.log('Packing (without passing archive name)..');
pack(whatToPack, null, { force: true });
console.log(`\u001b[32mdone.\u001b[0m`);

console.log('Packing..');
const packResults = pack(whatToPack, file, { force: true });
// packResults { ommited, packed, file, includes: what, size, sizeMB }

console.log(`\u001b[32mdone.\u001b[0m`);
if (packResults) {
  if (packResults.packed) {
    console.log(`\u001b[34;1mPacked files: \u001b[0m`);
    for (pp of packResults.packed) {
      console.log(pp);
    }
  }

  if (packResults.ommited) {
    console.log(`\u001b[34;1mOmmited files (by .gitignore):\u001b[0m`);
    for (pp of packResults.ommited) {
      console.log(pp);
    }
  }

  // Unpacking
  const tempFolder = require('os').tmpdir();
  console.log(`Unpacking ${file}.. to: ${tempFolder}`);
  unpack(file, tempFolder); // extract files to the tmp folder
  console.log(`\u001b[32mdone.\u001b[0m`);
} else {
  console.error(`Pack failed.`);
  process.exitCode = 1;
}
