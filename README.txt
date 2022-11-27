#### PWA MAP PROJECT ####
 Requirements:
 Node.js
 NPM
 MongoDB
 Chrome
 Mobile device/ Emulator(Android Studio, etc)



1. save to any location with Node and NPM installed to.
2. open in terminal and run command "npm install".
3. once ready navigate to "https//:localhost:3000"
4. the application will load but an error will appear in the console failing to load or register the service worker
5. navigate to the begining of the URL bar and press the "Not secure" text.
6. once there click and select "Certificate".
7. a window will appear with the SSL information naviate to details and press "Copy to File...".
8. go though the wizard leaving the standard settings as they are.
9. when you reach file export name the SSL file and choose a storage location.
10. Press next then Finished on the wizard.
11. in Chrome open the settings.
12. search for "SSL" and select manage certificates.
13. navigate to Trusted Root Certification Authoritites and select import.
14. find the file you have created from the previous steps.
15. popups will appear on the screen asking if you want to trust this SSL select ok.
16. this will have fixed the service worker issue thus enabling offline and PWA functionality for the application.
17. when testing make sure you do not select offline in chrome devloper tools as some of the apis used bypass this turn off your internet via the icon on the task bar or in settings.
18. when checking the console certains errors may appear this is normal in offline mode as this is trying to render information it does not have.


#### MongoDB Installation ####
1. Download MongoDB from the website.
2. Follow the steps to install the application.
3. Once installed navigate to the installation folder.
4. navigate to C:\Program Files\MongoDB\Server\4.2\bin in my case but version number and location may differ if location has been changed from default and copy the folder location
5. in a CMD or other terminal type cd then the folder location then press enter.
6. once in this directory type mongod in the terminal and this will start the database.
7. ensure that this ternimal is open in the background otherwise the database would close down.

#### Instalation of application ####
1. Download the project and unzip the project.
2. in a terminal with Node.js installed navigate to the folder location and cd to that directory.
3. then type npm install and this will install all the needed dependencies for the application to work.
4. if the steps above have been followed correctly then navigate to https://localhost:3000 to make the application appear.



any questions/troubleshooting make sure to email at 19036420@stu.mmu.ac.uk.