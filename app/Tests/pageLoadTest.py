from helium.api import *

start_chrome("localhost:3333")
if 'Datascape' in get_driver().title:
    print 'Page loaded successfully.'
else:
    print 'Failed to load page.'
kill_browser()
