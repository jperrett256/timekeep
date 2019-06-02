const { remote } = require('electron');

$("#min-btn").click(function () {
    let win = remote.getCurrentWindow();
    win.minimize();
});

$("#max-btn").click(() => {
    let win = remote.getCurrentWindow();
    if (!win.isMaximized()) {
        win.maximize();
    } else {
        win.unmaximize();
    }
});

$("#close-btn").click(function () {
    let win = remote.getCurrentWindow();
    win.hide();
});

function onMax() {
	$('#max-btn .icon').attr('data', 'icons/restore.svg');
    $('.draggable').addClass('maximised');
}
function onUnmax() {
	$('#max-btn .icon').attr('data', 'icons/maximise.svg');
    $('.draggable').removeClass('maximised');
}
remote.getCurrentWindow()
	.on('maximize', onMax)
	.on('unmaximize', onUnmax);

//cleanup
window.addEventListener('beforeunload', function () {
	remote.getCurrentWindow()
		.removeListener('maximize', onMax)
		.removeListener('unmaximize', onUnmax);
});
