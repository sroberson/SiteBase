The Hartford PlayOn Portal

The social share information requires absolute urls to things like the little image that appears
when you share via LinkedIn or Facebook, etc.

As such to verify that these social share functions work, we've had to hard-code the paths to our
local staging environment.

For example, in each html file, around line 18, there is a line that looks like:

<meta property="og:image" content="http://playon.thehartford.resultsbuilderstage.com/ui/images/tier/Biz_Auto_1280x350.jpg?af60f?bust">

For the social share functionality in these html pages to work in an environment that is NOT located
at *playon.thehartford.resultsbuilderstage.com*, this path will need to be updated, accordingly.


For example, for these html pages to work at http://qawww.thehartford.com/dm/playon/, line 18 (line
17 on the home page) will need to be changed to:

<meta property="og:image" content="http://qawww.thehartford.com/dm/playon/ui/images/tier/Biz_Auto_1280x350.jpg?af60f?bust">

Note that this path needs to point to wherever the /ui folder is located.  This could be at any
location you choose. As long as this location is a valid, externally-accessible location, the social share
functions will work.

So, you'll want to update this path for your UAT environment.

*** But BEFORE you promote this file to Production, you'll want to update these paths to point to whatever the
production url will be.  i.e. http://www.thehartford.com/dm/playon/

**********************************

TL;DR


In summary, the hard-coded urls in line 18/17 of each html file will need to be replaced with either
of the below lines, depending on what environment the pages reside- UAT/STAGE or PROD.

So, your updated line 18/17 will be either

<meta property="og:image" content="http://qawww.thehartford.com/dm/playon/ui/images/tier/Biz_Auto_1280x350.jpg?af60f?bust">

or

<meta property="og:image" content="http://www.thehartford.com/dm/playon/ui/images/tier/Biz_Auto_1280x350.jpg?af60f?bust">


*****

Feel free to contact Scott Roberson at Primacy at scott.roberson@theprimacy.com if you have any questions about any of this.


********************************

Alternately, if these pages were turned into .jsp or .php pages, the above hard-coded path could be output with some code
that would derive what the current server/path is, but that would be up to you to implement as that is beyond the scope
of this project.

I did find two possible ways to do this for jsp:  http://stackoverflow.com/a/6271253/203141

And for php you'd replace the path with <?php echo "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; ?> making line 17/18 be:

<meta property="og:image" content="<?php echo "http://".$_SERVER[HTTP_HOST].$_SERVER[REQUEST_URI]; ?>/ui/images/tier/Biz_Auto_1280x350.jpg?af60f?bust">



