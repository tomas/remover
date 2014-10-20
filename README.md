Remover
======

Recursively asyncronously removely a directory.

Install
-------

    npm install remover

Example
-----

``` js
var rmdir = require('remover');

var remover = rmdir('/path/to/remove', function(err, removed_files) {
  if (!err) console.log(removed_files); // prints list of files removed
});

// wait 1 second and then stop the removal process
setTimeout(function() {
  remover.stop();
}, 1000);
```

Credits
-------
Written by Tomás Pollak.

Copyright
---------
(c) 2014 Fork Ltd. MIT licensed.

