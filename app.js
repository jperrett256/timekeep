const { app, BrowserWindow, nativeImage, Menu, Tray, ipcMain } = require('electron');
const Store = require('electron-store');
const store = new Store();

let state = {
	tasks: store.get('tasks') || {},
	currentTask: store.get('currentTask')
};

ipcMain.on('update-current-task', (event, task) => {
	state.currentTask = task;
});

ipcMain.on('get-updated-task-state', (event) => {
	event.reply('task-state-updated', state);
});

ipcMain.on('add-new-task', (event, name) => {
	let task = {
		name: name
		// TODO task data
	};
	let id = Date.now();
	state.tasks[id] = task;

	if (!state.currentTask) {
		state.currentTask = id;
	}

	event.reply('task-state-updated', state);
});

let tray = null;
app.on('ready', function () {
    let win = new BrowserWindow({
    	webPreferences: {
    		nodeIntegration: true
    	},
        width: 800,
        height: 600,
        frame: false,
        title: 'timekeep',
        icon: nativeImage.createFromPath(__dirname + '/icons/clock.png')
    });

	win.setMinimumSize(700, 500);
    win.loadURL('file://' + __dirname + '/content/index.html');

    let clockRunning = false;
    let clockStartTime;

    tray = new Tray(__dirname + '/icons/clock.png');
    tray.on('click', () => win.show());
    tray.setToolTip('timekeep');
    tray.setContextMenu(getContextMenu());

    ipcMain.on('update-renderer-time', updateTime);

    function getContextMenu() {
    	return Menu.buildFromTemplate([
    		{
    			label: clockRunning ? 'Pause' : 'Start',
    			click: toggleClock
    		},
    		{
    			label: 'Quit',
    			click: () => app.quit()
    		}
    	]);
    }

    function toggleClock() {
    	clockRunning = !clockRunning;
    	if (clockRunning) clockStartTime = Date.now();
    	updateTime();
    	tray.setContextMenu(getContextMenu());
    }

    function updateTime() {
    	if (clockRunning) {
    		win.webContents.send('start-clock', clockStartTime);
    	} else {
    		win.webContents.send('stop-clock');
    	}
    }
});
