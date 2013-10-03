The idea of this is to create a wiki that works with pure Javascript. No
server-side code, and no Flash or Java kludges to store data. It uses
HTML5's localStorage API as it's primary data source. It was mostly an experiment
with the localStorage API, as a more usable version would provide some way
to export/import data to keep it in the case of history being cleared, or to move
data from one computer to another.

###Usage instructions
#### Starting
1. Download the [latest version](https://github.com/tonyfinn/Sparrow/archive/master.zip)
2. Unzip it to a location of your choice.
3. Open index.html using a web browser.

#### Editing
1. Choose the page you wish to edit by entering it's name in the box at the top of the page.
2. Click Go.
3. Click the Edit link at the bottom of the page.


###Limitations
* Browsers implement a 5MB size limit on localStorage. It can only store
as many pages as fit into that limit. Apparently in the future it will
be possible for apps to request more space, but no current browser
implements this.
* If you clear your cookies, most browsers also clear localStorage which
  will wipe your data. An export function will be implemented soon, but
  for now all data stored in it is temporary.

###Support
Currently, it works on Chrome, the Android browser and Opera, and theoretically works on Safari though
I have not tested that yet. It works on Firefox 4+ when served from a web
server, as Firefox does not persist localStorage when the page is opened
on a file:// url due to sandboxing concerns. It does not work on IE < 10, and has not
been tested on IE 10.

###Formatting
The formatting is done using Markdown. More specifically, it is rendered
using Stack Overflow's PageDown editor, [found here](http://code.google.com/p/pagedown/)

###License
The current version is licensed under the MIT license. See LICENSE.txt
for details.
