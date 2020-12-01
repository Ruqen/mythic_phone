fx_version 'adamant'

game 'gta5'

ui_page 'html/index.html'

files {
	'html/index.html',
	'html/css/materialize.min.css',
	'html/css/style.min.css',
    'html/libs/jquery-ui.min.css',
    
    'html/js/build.js',

    'html/libs/all.min.css',
    'html/libs/jquery.min.js',
    'html/libs/jquery.mask.min.js',
    'html/libs/jquery-ui.min.js',
    'html/libs/materialize.min.js',
    'html/libs/moment.min.js',

    'html/webfonts/fa-brands-400.eot',
    'html/webfonts/fa-brands-400.svg',
    'html/webfonts/fa-brands-400.ttf',
    'html/webfonts/fa-brands-400.woff',
    'html/webfonts/fa-brands-400.woff2',
    'html/webfonts/fa-regular-400.eot',
    'html/webfonts/fa-regular-400.svg',
    'html/webfonts/fa-regular-400.ttf',
    'html/webfonts/fa-regular-400.woff',
    'html/webfonts/fa-regular-400.woff2',
    'html/webfonts/fa-solid-900.eot',
    'html/webfonts/fa-solid-900.svg',
    'html/webfonts/fa-solid-900.ttf',
    'html/webfonts/fa-solid-900.woff',
    'html/webfonts/fa-solid-900.woff2',

    'html/imgs/back001.png',
    'html/imgs/back002.png',
    'html/imgs/back003.png',
    'html/imgs/iphonex.png',
    'html/imgs/s8.png',
}

client_script {
	'@salty_tokenizer/init.lua',
    'config/config.lua',
    'config/apps.lua',
    'config/contacts.lua',

    "client/main.lua",
    "client/animation.lua",
    
	"client/apps/home.lua",
	"client/apps/contacts.lua",
	"client/apps/phone.lua",
	"client/apps/messages.lua",
	"client/apps/twitter.lua",
}

server_script {
	'@salty_tokenizer/init.lua',
    'config/config.lua',
    'config/apps.lua',
    'config/contacts.lua',

    "server/main.lua",
    "server/commands.lua",
    
	"server/apps/contacts.lua",
	"server/apps/phone.lua",
	"server/apps/messages.lua",
	"server/apps/twitter.lua",
}

dependency 'salty_tokenizer'