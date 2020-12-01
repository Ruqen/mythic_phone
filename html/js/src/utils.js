function DateSortNewest(a,b){
    if (a.time != null) {
        return a.time < b.time ? 1 : -1;  
    } else {
        return a.date < b.date ? 1 : -1;  
    }
};

function DateSortOldest(a,b){
    if (a.time != null) {
        return a.time > b.time ? 1 : -1;   
    } else {
        return a.date > b.date ? 1 : -1;   
    }
};

function UpdateClock(time) {
    $('.time span').html(time)
}

function NotifyAltSim(status) {
    if (status) {
        $('.simcard').fadeIn();
    } else {
        $('.simcard').fadeOut();
    }
}

function NotifyPayphone(status) {
    if (status) {
        $('.payphone').fadeIn();
    } else {
        $('.payphone').fadeOut();
    }
}

function SetMute(status) {
    if (status) {
        $('.mute').html('<i class="fas fa-volume-mute"></i>');
        $('.mute').removeClass('not-muted').addClass('muted');
        StoreData('muted', true);
    } else {
        $('.mute').html('<i class="fas fa-volume-up"></i>');
        $('.mute').removeClass('muted').addClass('not-muted');
        StoreData('muted', false);
    }
}

export default { DateSortNewest, DateSortOldest, UpdateClock, NotifyAltSim, NotifyPayphone, SetMute }