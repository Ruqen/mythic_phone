import App from '../app';
import Data from '../data';

var apps = null;

$('#home-container').on('click', '.app-button', function(event) {
    App.OpenApp($(this).data('container'));
});

function SetupHome() {
    apps = Data.GetData('apps');
    $('#home-container .inner-app').html('');
    $.each(apps, function(index, app) {
        if (app.enabled) {
            if (app.unread > 0) {
                $('#home-container .inner-app').append('<div class="app-button" data-tooltip="' + app.name + '"><div class="app-icon" id="' + app.container + '-app" style="background-color: ' + app.color + '"> ' + app.icon + '<div class="badge pulse">' + app.unread + '</div></div></div>')
            } else {
                $('#home-container .inner-app').append('<div class="app-button" data-tooltip="' + app.name + '"><div class="app-icon" id="' + app.container + '-app" style="background-color: ' + app.color + '"> ' + app.icon + '</div></div>')
            }
            let $app = $('#home-container .app-button:last-child');

            $app.tooltip( {
                enterDelay: 0,
                exitDelay: 0,
                inDuration: 0,
            });
    
            $app.data('container', app.container);
        } 
    });
}

function ToggleApp(name, status) {
    let pApp = Apps.filter(app => app.container === name)[0];

    if (!status) {
        $('#' + pApp.container + '-app').parent().fadeOut();
        pApp.enabled = false;
    } else {
        pApp.enabled = true;
        SetupHome()
    }
}

function UpdateUnread(name, unread) {
    if (apps == null) {
        apps = Data.GetData('apps');
    }

    $.each(apps, function(index, app) {
        console.log(JSON.stringify(app));
        if (app.container === name) {
            app.unread = unread
            Data.SetData('apps', apps);
            SetupHome();
            return false;
        }
    });
}

export default { SetupHome, ToggleApp, UpdateUnread }