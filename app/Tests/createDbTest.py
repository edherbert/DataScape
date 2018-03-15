from helium.api import *

start_chrome("localhost:3333")
click("Create a database")
press("TAB")
write("databaseTest")
click("confirm")
if Text("databaseTest").exists():
    print "Database created successfully."
else:
    print "Unable to create database."
kill_browser()
