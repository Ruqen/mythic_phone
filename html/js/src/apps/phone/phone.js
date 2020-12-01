import App from '../../app';
import Config from '../../config';
import Utils from '../../utils';
import Data from '../../data';
import Call from './call';
import Contacts from '../contacts';

var myNumber = null;
var contacts = null;
var history = null;

var delHold = null;

$('.phone-nav-button').on('click', function(e) {
    if (!($(this).hasClass('active-nav'))) {
        let activeSection = $('.active-nav').data('nav');
        $('.active-nav').removeClass('active-nav');
    
        let section = $(this).data('nav');
        $(this).addClass('active-nav');
        $('[data-section=' + activeSection + ']').fadeOut('fast', function() {
            $('[data-section=' + section + ']').fadeIn();
        });
    }
});

$('[data-section=keypad').on('click', '.keypad-top .delete-num-btn', function(e) {
    let number = $('.keypad-top #number').val();
    if (number.length > 0) {
        let delNum = number.substring(0, number.length - 1);
        $('.keypad-top #number').val($('.keypad-top #number').masked(delNum));
    } else if($('.keypad-top #type').val() != null) {
        $('.keypad-top #type').val('');
    }

    CheckIfContact($('.keypad-top #number').val());
    SetupCallType();
});

$('[data-section=keypad').on('mousedown', '.keypad-top .delete-num-btn', function(e) {
    let number = $('.keypad-top #number').val();
    delHold = setInterval(function(){
        if (number.length > 0) {
            let delNum = number.substring(0, number.length - 1);
            $('.keypad-top #number').val($('.keypad-top #number').masked(delNum));
            number = $('.keypad-top #number').val();
            CheckIfContact($('.keypad-top #number').val());
            SetupCallType();
        }
    }, 250);

    return false;
});

$('[data-section=keypad').on('submit', '#call-number', function(e) {
    e.preventDefault();
    let data = $(this).serializeArray();
    CreateCall(data[1].value, (data[0].value === '#' || data[0].value === '*'), false);
});

$(document).mouseup(function(){
    clearInterval(delHold);
    return false;
});

$('[data-section=keypad').on('click', '.keypad-key', function(e) {
    if (!$(this).hasClass('key-call')) {
        let key = $(this).data('value');
        let exist = $('.keypad-top #number').val();
        if (key === '#' || key === '*') {
            if ($('.keypad-top #type').val() === key) {
                $('.keypad-top #type').val('');
            } else {
                $('.keypad-top #type').val(key);
            }
        }
        else if (exist.length < 12) {
            exist = exist + key;
            $('.keypad-top #number').val($('.keypad-top #number').masked(exist));
        }
    }

    CheckIfContact($('.keypad-top #number').val());
    SetupCallType();
    $('.keypad-top #number').get(0).focus();
});

$('[data-section=history').on('click', '.call', function(event) {
    if ($(this).find('.call-actions').is(":visible")) {
        $(this).find('.call-actions').slideUp();
    } else {
        $(this).parent().find('.call-actions').slideUp();
        $(this).find('.call-actions').slideDown();
    }
});

$('[data-section=history').on('click', '.call-actions .call-action-call', function(e) {
    let data = $(this).parent().parent().data('data');
    let number = data.sender;
    if (data.sender == myNumber) {
        number = data.receiver;
    }
    CreateCall(number, false, false);
});

$('[data-section=history').on('click', '.call-actions .call-action-text', function(e) {
    let data = $(this).parent().parent().data('data');
    let number = data.sender;

    if (data.sender == myNumber) {
        number = data.receiver;
    }

    App.OpenApp('message-convo', { number: number });
});

$('[data-section=history').on('click', '.call-actions .call-action-delete', function(e) {
    let data = $(this).parent().parent().data('data');
    $.post(Config.ROOT_ADDRESS + '/DeleteCallRecord', JSON.stringify({
        id: data.id
    }), function(status) {
        if (status) {
            $(this).parent().parent().fadeOut('normal', function() {
                history.splice(data.index, 1);
                App.StoreData('history', history);
                App.RefreshApp();
                M.toast({html: 'Call Record Deleted'});
            });
        } else {
            M.toast({html: 'Error Deleting Call Record'});
        }
    })
});

$('[data-section=contacts').on('keyup', '.contact-search input', function(e) {
    e.preventDefault();
    let searchVal = $(this).val();

    if (searchVal !== '') {
        $.each($(this).parent().parent().find('.contacts-list').children(), function(index, contact) {
            let data = $(contact).data('data');
    
            if (data.name.toUpperCase().includes(searchVal.toUpperCase()) || data.number.includes(searchVal.toUpperCase())) {
                $(contact).fadeIn();
            } else {
                $(contact).fadeOut();
            }
        });
    } else {
        $.each($(this).parent().parent().find('.contacts-list').children(), function(index, contact) {
            $(contact).fadeIn();
        });
    }
});

$('[data-section=contacts').on('click', '.phone-contact', function(event) {
    if ($(this).find('.call-actions').is(":visible")) {
        $(this).find('.call-actions').slideUp();
    } else {
        $(this).parent().find('.call-actions').slideUp();
        $(this).find('.call-actions').slideDown();
    }
});

$('[data-section=contacts').on('click', '.call-actions .call-action-call', function(e) {
    let data = $(this).parent().parent().data('data');
    CreateCall(data.number, false, false);
});

$('[data-section=contacts').on('click', '.call-actions .call-action-text', function(e) {
    let data = $(this).parent().parent().data('data');
    App.OpenApp('message-convo', { number: data.number });
});

$('.call-action-mute').on('click', function(e) {
    
})

function CheckIfContact(number) {
    let contact = contacts.filter(c => c.number == number)[0];
    if (contact != null) {
        $('.keypad-top .contact-display').html(contact.name);
        $('.keypad-top .contact-display').fadeIn();
    } else {
        $('.keypad-top .contact-display').fadeOut();
    }
}

function SetupCallType() {
    let number = $('.keypad-top #type').val();

    if (number[0] === '#') {
        $('.keypad-top .call-type').html('Calling Anonymously');
        if ($('.keypad-top .call-type').is(":hidden")) {
            $('.keypad-top .call-type').fadeIn();
        }
    } else if (number[0] == '*') {
        $('.keypad-top .call-type').html('Calling UNK');
        if ($('.keypad-top .call-type').is(":hidden")) {
            $('.keypad-top .call-type').fadeIn();
        }
    } else {
        if ($('.keypad-top .call-type').is(":visible")) {
            $('.keypad-top .call-type').fadeOut('fast', function() {
                $('.keypad-top .call-type').html('CALL TYPE');
            });
        }
    }
}

function CreateCall(number, nonStandard, receiver) {    
    $.post(Config.ROOT_ADDRESS + '/CreateCall', JSON.stringify({
        number: number,
        nonStandard: nonStandard
    }), function(status) {
        if (status > 0) {
            App.OpenApp('phone-call', { number: number, nonStandard: nonStandard, receiver: receiver})
        } else if (status == -2) {
            M.toast({html:'Can\'t Call Yourself, Idiot'})   
        }else if (status == -3) {
            M.toast({html:'Number is Busy'})
        } else {
            M.toast({html:'Number Not Currently Active'})
        }
    });
}

function SetupCallHistory() {
    myNumber = Data.GetData('myNumber');
    contacts = Data.GetData('contacts');
    history = Data.GetData('history');

    SetupCallContacts();

    history.sort(Utils.DateSortOldest);

    $('[data-section=history').html('');
    $.each(history, function(index, call) {
        if (call.sender == myNumber) {
            let contact = contacts.filter(c => c.number == call.receiver)[0];

            if (call.status == 0) {
                if (contact != null) {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone icon-outgoing-missed"></i><span>' + contact.name + '</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                } else {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone icon-outgoing-missed"></i><span>' + call.receiver + '</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                }
            } else if (call.status == 1) {
                if (contact != null) {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone icon-outgoing"></i><span>' + contact.name + '</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                } else {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone icon-outgoing"></i><span>' + call.receiver + '</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                }
            }
        } else {
            if (call.anon == 0) {
                let contact = contacts.filter(c => c.number == call.sender)[0];
                if (call.status == 0) {
                    if (contact != null) {
                        $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming-missed"></i><span>' + contact.name + '</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                    } else {
                        $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming-missed"></i><span>' + call.sender + '</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                    }
                } else if (call.status == 1) {
                    if (contact != null) {
                        $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming"></i><span>' + contact.name + '</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                    } else {
                        $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming"></i><span>' + call.sender + '</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                    }
                }
            } else {
                if (call.status == 0) {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming"></i><span>Unknown Number</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume action-disabled"></i><i class="fas fa-sms action-disabled"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                } else {
                    $('[data-section=history').prepend('<div class="call"><i class="fas fa-phone-alt icon-incoming"></i><span>Unknown Number</span><div class="timestamp">' + moment(call.date).calendar() + '</div><div class="call-actions"><i class="fas fa-phone-volume action-disabled"></i><i class="fas fa-sms action-disabled"></i><i class="fas fa-trash-alt call-action-delete"></i></div></div>');
                }
            }
        }

        call.index = index;
        $('[data-section=history').find('.call:first-child').data('data', call);
    });
    setTimeout(function() { $('.keypad-top #number').get(0).focus(); }, 1500);
}

function SetupCallContacts() {
    $('[data-section=contacts').find('.contacts-list').html('');

    contacts.sort(Contacts.SortContacts);

    $.each(contacts, function(index, contact) {
        $('[data-section=contacts').find('.contacts-list').append('<div class="phone-contact"><div class="phone-avatar other-' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div>' + contact.name + '<div class="call-actions"><i class="fas fa-phone-volume call-action-call"></i><i class="fas fa-sms call-action-text"></i></div></div>');
        $('[data-section=contacts').find('.contacts-list').find('.phone-contact:last-child').data('data', contact);
    });
}

export default { SetupCallHistory, CreateCall, Call }