# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
##
waste-management-system/
├── backend/                   # Node.js Backend
│   ├── controllers/           # Business logic for routes
│   │   ├── binController.js   # Contains logic to interact with bins (CRUD operations)
│   │   └── sensorController.js# Logic for handling sensor data from Raspberry Pi
│   ├── models/                # Database models
│   │   ├── binModel.js        # Bin model for MySQL (bins table)
│   │   ├── sensorDataModel.js # Sensor data model (sensor_data table)
│   │   └── notificationModel.js # Notification model (notifications table)
│   ├── routes/                # API Routes
│   │   ├── binRoutes.js       # Route handlers for bin operations
│   │   └── sensorRoutes.js    # Route handlers for sensor data
│   ├── config/                # Configuration files
│   │   └── db.js              # MySQL database connection setup
│   ├── server.js              # Entry point of Node.js backend
│   └── package.json           # Backend dependencies
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Dashboard.js   # Dashboard to show real-time bin statuses
│   │   │   ├── BinMap.js      # Interactive map with bin locations
│   │   │   └── Notifications.js # Component for alerts and notifications
│   │   ├── pages/
│   │   │   └── Home.js        # Home page structure with key sections
│   │   ├── services/          # Services to fetch bin data from API
│   │   │   └── binService.js  # API calls to backend for bin operations
│   │   │   └── sensorService.js # API calls to handle sensor data
│   │   ├── App.js             # Main App component
│   │   └── index.js           # Entry point for React
│   └── package.json           # Frontend dependencies
├── pi-scripts/                # Raspberry Pi Python scripts for sensors
│   └── send_sensor_data.py    # Script to collect sensor data and send to backend
├── database/                  # SQL database scripts
│   └── init_db.sql            # SQL script to initialize and create MySQL tables
├── README.md                  # Project documentation

test data for bin sensor
url:
http://localhost:3001/api/bins/BIN-001
{
	"message": "Bin BIN-001 updated successfully",
	"result": {
		"fieldCount": 0,
		"affectedRows": 1,
		"insertId": 0,
		"serverStatus": 2,
		"warningCount": 0,
		"message": "(Rows matched: 1  Changed: 0  Warnings: 0",
		"protocol41": true,
		"changedRows": 0
	}
}