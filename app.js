const { app, BrowserWindow, nativeImage, Menu, Tray } = require('electron');

let tray = null;
app.on('ready', function () {
    let main_window = new BrowserWindow({
    	webPreferences: {
    		nodeIntegration: true
    	},
        width: 800,
        height: 600,
        frame: false,
        title: 'timekeep',
        icon: nativeImage.createFromPath(__dirname + '/icons/clock.png')
    });

	main_window.setMinimumSize(700, 500);
    main_window.loadURL('file://' + __dirname + '/content/index.html');

    tray = new Tray(__dirname + '/icons/clock.png');
    tray.on('click', () => main_window.show());
    const contextMenu = Menu.buildFromTemplate([
    	{
    		label: 'Quit',
    		click: () => app.quit()
    	}
    ]);
    tray.setToolTip('This is timekeep.');
    tray.setContextMenu(contextMenu);
});