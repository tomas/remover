var fs      = require('fs'),
    join    = require('path').join,
    resolve = require('path').resolve;

var backend = fs;
var output  = null;

//////////////////////////////////////////////////////
// helpers

function write(str) {
  if (output)
    output.write(str + '\n');
}

function rmdir(dir, cb) {
  backend.rmdir(dir, function(err) {
    if (!err) write('Directory removed: ' + dir);
    cb(err);
  });
}

function unlink(file, cb) {
  backend.unlink(file, function(err) {
    if (!err) write('File removed: ' + file);
    cb(err);
  });
}

//////////////////////////////////////////////////////
// the remover object

var Remover = function(path) {
  this.path = resolve(path).replace('*', '');
  // if path includes a * at the end, do not remove dir
  this.remove_dir = !path.match(/\*$/);
  this.stopped = false;
}

Remover.prototype.start = function(cb) {
  if (this.stopped) {
    throw new Error('Already stopped!');
  }

  this.walk(this.path, this.remove_dir, cb);
}

Remover.prototype.stop = function() {
  write('Stopping removal!');
  this.stopped = true;
}

Remover.prototype.walk = function(dir, remove_dir, cb) {
  write('Walking directory: ' + dir);

  var self = this,
      count,
      last_err,
      files_removed = [];

  var done = function(err, removed) {
    if (err) last_err = err;

    if (removed) {
      files_removed = files_removed.concat(removed);
    }

    --count || finished();
  }

  var finished = function() {
    if (!remove_dir)
      return cb(last_err, files_removed);

    rmdir(dir, function(err) {
      cb(err || last_err, files_removed);
    })
  }

  fs.readdir(dir, function(err, files) {
    if (err || self.stopped)
      return cb(err);

    if (files.length == 0)
      rmdir(dir, cb);

    count = files.length;

    files.forEach(function(file, index) {
      var path = join(dir, file);

      fs.lstat(path, function(err, stat) {
        if (err || self.stopped)
          return cb(err);

        if (stat.isDirectory()) { // recurse
          self.walk(path, true, done);
        } else {
          unlink(path, function(err) {
            if (!err) files_removed.push(path);
            done(err);
          });
        }
      })
    })
  })

}

function remove(path, opts, cb) {
  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }

  var remover = new Remover(path);
  remover.start(cb);
  return remover;
}

function set_output(stream) {
  output = stream;
}

function set_backend(obj) {
  backend = obj;
}

module.exports = remove;
remove.output  = set_output;
remove.backend = set_backend;
