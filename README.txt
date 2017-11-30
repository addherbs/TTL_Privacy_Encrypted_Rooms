
Check if port 5000 is available on your computer/laptop, if not. Kill the port for the application to work

	netstat -ano | findstr :5000
			This will list all the ports. Get the PID of your port from here. It will be on the last column of your port
			
To kill your port:

	taskkill /PID ThePIDYouGot /F
	
The port is availabe to use now


Step 1: Clone or download the folder from GitHub.

Step 2: Download Node.js Cli and Mongodb in your system.

Step 3: To install node modules that are there in project:

			npm install npm-install-all
		
		To install them globally:
		
			npm install npm-install-all -g
		
		
		Wait for the modules to download successfully
		
		
Step 4: Run the application using command:
		
		node ./app.js
		
Srep 5: Open a latest web browser and go to the URL:

		localhost:5000