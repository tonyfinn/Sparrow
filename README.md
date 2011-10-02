The idea of this is to create a wiki that works with pure JS. No
server-side code, and no Flash or Java kludges to store data. It is
using HTML5's localStorage as it's primary data source.

###Limitations
* Some browsers implement a size limit on localStorage. It can only store
as many pages as fit into that limit. Apparently in the future it will
be possible for apps to request more space, but no current browser
implements this.
* If you clear your cookies, most browsers also clear localStorage which
  will wipe your data. An export function will be implemented soon, but
  for now all data stored in it is temporary.

###Support
Currently, it works on Chrome, and theoretically works on Safari though
I have not tested that yet. It works on Firefox 4+ when served from a web
server, as Firefox does not persist localStorage when the page is opened
on a file:// url due to sandboxing concerns. It does not work on IE, any
version.

###Formatting
The formatting is done using Markdown. More specifically, it is rendered
using Stack Overflow's PageDown editor, [found here](http://code.google.com/p/pagedown/)

###License
The current version is licensed under the MIT license. See LICENSE.txt
for details.
