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

remover('/path/to/remove', function(err, removed_files) {
  if (!err) console.log(removed_files); // prints list of files removed
});

```

Credits
-------
Written by Tomás Pollak.

Copyright
---------
(c) 2014 Fork Ltd. MIT license.

