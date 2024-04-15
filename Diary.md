__**DIARY FOR FINAL YEAR PROJECT**__
-> Diary to allow me to note down and reflect throughout the final year project.

**Friday 29/09/2023 - Supervisor Meeting:**
The first supervisor meeting consisted with a range of queries on how my Offline HTML5 APP should be executed along with other ideas that should be taken into consideration. Also spoke about time organisation and how to structure the final year project as a whole.

**Thursday 05/10/2023 - Extensive Research**
Conducted research on HTML5 offline technologies, OSM data retrieval, and vector map rendering.

**Friday 20/10/2023 - Additional Research**
In addition, I have researched different types of testing frameworks that will be suitable for HTML5 and JavaScript in order to use TDD when making the concept programs.

**Tuesday 24/10/2023 - Start of TDD for Hello World**
Using Jasmine to apply TDD for the first concept program.
I have not encountered any issues for this program yet although due to unexpected complexities I am behind the schedule that was made in the project plan.

**Friday 03/11/2023 - Supervisor Meeting 2:**
Although only a few TDD tests have already been committed for one of the concept programs, it was suggested from the Supervisor to use Jest Testing framework instead of Jasmine/Mocha (Mocha was the most recent used). Mainly discussed about the overview and specification of the project as a whole. As a little behind schedule, it's appropriate to reflect, mitigate and evaluate towards the end. Supervisor also mentioned the two alternatives: Either implement OSM by myself or Install a library in which higher expectations are brought if that route is taken.

**Friday 17/11/2023 - Concept Program 1 Done:**
Despite the delay, using Jest Testing framework we have successfully passed the two TDD tests for the Offline HelloWorld Program. Did encounter problem with service-worker and refactored the way it fetched the request. Should be able to load cache files in an offline status now.

**Monday 20/11/2023 - Start Concept Program 2:**
Beginning of constructing a Todo list application using WebStorage. This application should contain several functions to add, display and clear tasks in which the tasks will be stored into the local storage of the browser. No TDD tests will be constructed as Jest framework doesn't have the ability to interact with the real browser environment especially local storage. However, formal testing will be documented and carried out to make sure all functions work.

**Monday 20/11/2023 - Concept Program 2 Done:**
Todo list application has been implemented with functions that can successfully add tasks, remove tasks and clear all tasks whilst all on display. Test screenshots for each function have been documented to show that the tasks work efficiently on local storage and will be altered depending on which function has been used. This application is a simple design and can easily be modified for a better interface.

**Tuesday 21/11/2023 - Start Concept Program 3:**
Begin to construct an application to draw shapes using HTML5 Canvas. <canvas> is used to draw graphics and should be able to make all sort of different shapes. Also using Jest and TDD to test this application throughout.

_Update:_ TDD will not be used for this specific concept program however, Test screenshots will be provided to prove that the program has the correct functionality and works properly.

**Wednesday 22/11/2023 - Concept Program 3 Done:**
Managed to complete Shapes Drawing Application which allows you to select from a small range of shapes which can then be drawn onto the canvas wherever the mouse cursor has clicked on the canvas. Screenshots have been provided and documented to show the application has no errors but the correct functionality. This simple app can be more complex if wanted to by adding a larger range of shapes as well as different sizez or colours etc. Few minor issues whilst making this application such as constructing a triangle (especially with parameters) but no major issues were caused.

**Wednesday 22/11/2023 - Start Concept Program 4:**
Starting the final concept program and aim to create some sort of web page that should load and list raw data from Open Street Map. It's most likely that a library will be used in order to retrieve this data.

**Saturday 25/11/2023 - Concept Program 4 Done:**
Simple web page has been constructed to retrieve data from OpenStreetMap using Leaflet library in which this data can be displayed. This web page passes both TDD tests to make sure a map element is initalised as well as that the leaflet library loads properly. Although this code works completely fine, I may want to refactor this code and access OSM data using an API such as _Overpass API_ along with Leaflet.

**Wednesday 29/11/2023 - Supervisor Meeting 3:**
Discussed about the final concept program and interim. Although Concept Program 4 demonstrates well using leaflet library, need to refactor the program so it loads and lists raw data on the web page (may have to use xml files).
Also was advised on how to conduct the interim report: All 4 reports all structure into one big report!

**Friday 08/12/2023 - Concept Program 4 Updated:**
Concept Program 4 has been refactored to correctly serve its purpose as it lists and loads map.osm in raw.

**Tuesday 23/01/2024 - Supervisor Meeting 4:**
As back from the holidays, ready to create the final application consisting of all concept programs created earlier in the project.
Discussed that writing more information including final deliverables towards the interim will create the final report. Have two options to either implement everything myself by parsing xml and vector tiles or decide to go and use a library like leaflet and start to make it more complex with more complicated features. 
Features can include displaying the shortest destination between two points as well as filtering -> eg finding restaurants/cafes with specific info.
Can use react but may be complex and time consuming but make sure to use some sort of database as well as test unit casing for the final application.

**Tuesday 27/03/2024 - (FINAL) Supervisor Meeting 5:**
After developing the final application we discussed final implementations and ways of making this application efficient. The application looks good and was also discussed that the offline feature needs to be implemented ASAP. Other than that, the application will finish up by completing the extended suggestions and final CSS.

**Friday 12/04/2024 - Final Offline HTML5 Maps Application developed:**
Offline HTML5 Maps Application has finally been developed and achieves the following:

_Offline functionality which:_
Allows the user to load and display map data.
Allows the user to zoom and move around the map.

_Extended features:_
Allows the user to search for interesting features.
Allows the dynamic display of different kinds of data (E.g. highlight cafes on screen).
Downloading map data dynamically when a connection is present.