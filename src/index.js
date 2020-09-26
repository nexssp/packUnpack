function loadCtx() {
  const ansi = require('@nexssp/ansi');
  const { d } = require('@nexssp/logdebug');
  const ignore = require('ignore');

  // Find a file + parent dirs
  const findParent = (item, cwd) => {
    const { statSync, existsSync } = require('fs');
    let oldPath = process.cwd();
    if (cwd) {
      if (existsSync(cwd)) {
        process.chdir(cwd);
      } else {
        throw new Error(`Path ${cwd} does not exist.`);
      }
    }

    const { resolve, join, dirname, parse } = require('path');

    const f = (i) => {
      try {
        if (statSync(i).isFile()) {
          return i;
        }
      } catch (error) {
        // console.log(error);
      }

      var parent = dirname(resolve('..', i));
      //console.log(parent);
      if (parse(parent).root === parent) {
        return null;
      }
      return f(join('..', i));
    };
    // We found a file in different folder so we are back
    process.chdir(oldPath);

    return f(item);
  };

  const { readFileSync, existsSync } = require('fs');

  const tar = require('tar'),
    path = require('path');
  return {
    findParent,
    bold: ansi.bold,
    tar,
    path,
    existsSync,
    readFileSync,
    ignore,
    d,
  };
}

function pack(what, file, opts = { gitignore: true }) {
  const ctx = loadCtx();
  if (!Array.isArray(what)) {
    what = [what];
  }
  // we check if averything exists
  for (const w of what) {
    if (!ctx.existsSync(w)) {
      throw new Error(`${w} does not exist.`);
    }
  }

  if (!file) {
    throw new Error(`Put the second parameter as a filename for the pack eg. mySuperPack.tar.gz.`);
  }

  if (!ctx.existsSync(file) && !opts.force) {
    throw new Error(`file exists: ${file} You can use opts.force=true.`);
  } else {
    // We find gitignore, or the very first in the parent
    let gitIgnoreFilePaths = [];
    let packed = [],
      ommited = [];
    const filter = (p, stat) => {
      let ig;
      const org = p;
      if (!gitIgnoreFilePaths[p]) {
        gitIgnoreFilePaths[p] = ctx.findParent('.gitignore', ctx.path.dirname(p));
        if (!gitIgnoreFilePaths[p]) {
          // no gitignore
          packed.push(org);
          return true;
        }
        ig = ctx.ignore().add(ctx.readFileSync(gitIgnoreFilePaths[p]).toString());
      }

      // relative? hmm
      if (p.indexOf(':') > -1) {
        p = p.split(':')[1].substring(1);
      }
      const ret = !ig.ignores(p);

      ctx.d('@nexssp/packunpack', p, 'ret: ', ret);

      if (ret) {
        packed.push(org);
      } else {
        ommited.push(org);
      }

      return ret;
    };
    ctx.tar.c(
      {
        gzip: true,
        file,
        filter: !opts.gitIgnore ? filter : () => true,
        sync: true,
      },
      what
    );

    const size = require('fs').statSync(file).size;
    const sizeMB = size / 1048576;

    return { ommited, packed, file, includes: what, size, sizeMB };
  }
}

function unpack(file, cwd) {
  const ctx = loadCtx();
  if (!cwd) {
    cwd = process.cwd();
  }
  if (!ctx.existsSync(cwd)) {
    throw new Error(`@nexssp/unpack: Desination folder ${cwd} does not exist.`);
  }

  if (Array.isArray(file)) {
    file = file[0];
  }

  ctx.tar.x({ file, cwd });

  return { file, directory: cwd };
}

module.exports = { pack, unpack };
