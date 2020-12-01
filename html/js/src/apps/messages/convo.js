import App from '../../app';
import Config from '../../config';
import Data from '../../data';
import Messages from './messages';

var myNumber = null;
var contacts = null;
var messages = null;

$('.convo-top-bar').on('click', '.convo-action-addcontact', function(e) {
    let data = $('#message-convo-container').data('data');
    $('#convo-add-contact-number').val(data.number);
});

$('#convo-add-contact').on('submit', function(e) {
    e.preventDefault();

    let data = $(this).serializeArray();

    let name = data[0].value;
    let number = data[1].value;

    $.post(Config.ROOT_ADDRESS + '/CreateContact', JSON.stringify({
        name: name,
        number: number,
    }), function(status) {
        if (status) {
            if (contacts == null) {
                contacts = new Array();
            }

            contacts.push({ name: name, number: number, index: contacts.length });
            Data.StoreData('contacts', contacts);

            var modal = M.Modal.getInstance($('#convo-add-contact-modal'));
            modal.close();

            $('#convo-add-contact-name').val('');
            $('#convo-add-contact-number').val('555-555-5555');

            M.toast({html: 'Contact Added'});
            RefreshApp();
        } else {
            M.toast({html: 'Error Adding Contact'});
        }
    });
})

$('#convo-new-text').on('submit', function(e) {
    e.preventDefault();
    let convoData = $('#message-convo-container').data('data');
    let data = $(this).serializeArray();
    
    let text = [
        {
            value: convoData.number,
        },
        {
            value: data[0].value
        }
    ]

    Messages.SendNewText(text, function(sent) {
        if (sent) {
            $('.convo-texts-list').append('<div class="text me-sender"><span>' + data[0].value + '</span><p>' + moment(Date.now()).fromNowOrNow() + '</p></div>');

        
            M.toast({html: 'Message Sent'});
            
            $('#convo-input').val('');


            if ($(".convo-texts-list .text:last-child").offset() != null) {
                $(".convo-texts-list").animate({
                    scrollTop: $('.convo-texts-list')[0].scrollHeight - $('.convo-texts-list')[0].clientHeight
                }, 200);
            }
        }
    });
});

$('#convo-delete-all').on('click', function(e) {
    e.preventDefault();
    let convoData = $('#message-convo-container').data('data');

    $.post(Config.ROOT_ADDRESS + '/DeleteConversation', JSON.stringify({
        number: convoData.number
    }), function(status) {
        if (status) {
            let cleanedMsgs = messages.filter(m => (m.sender != convoData.number) && (m.receiver != convoData.number));
            App.StoreData('messages', cleanedMsgs);
            M.toast({html: 'Conversation Deleted'});
            GoBack();
        } else {
            M.toast({html: 'Error Deleting Conversation'});
        }
    });
});

function ReceiveText(sender, text) {
    let viewingConvo = $('#message-convo-container').data('data');

    if (viewingConvo != null) {
        let contact = contacts.filter(c => c.number == viewingConvo.number)[0];
        if (viewingConvo.number == text.sender) {
            if (contact != null) {
                $('.convo-texts-list').append('<div class="text other-sender"><span class=" other-' + contact.name[0] + '">' + text.message + '</span><p>' + moment(Date.now()).fromNowOrNow() + '</p></div>')
            } else {
                $('.convo-texts-list').append('<div class="text other-sender"><span>' + text.message + '</span><p>' + moment(Date.now()).fromNowOrNow() + '</p></div>')
            }

            if ($(".convo-texts-list .text:last-child").offset() != null) {
                $(".convo-texts-list").animate({
                    scrollTop: $('.convo-texts-list')[0].scrollHeight - $('.convo-texts-list')[0].clientHeight
                }, 200);
            }
        }
    }

    if (messages == null) {
        messages = Data.GetData('messages');
    }

    if (myNumber == null) {
        myNumber = Data.GetData('myNumber');
    }

    messages.push({
        sender: text.sender,
        receiver: myNumber,
        message: text.message,
        sent_time: text.sent_time,
        sender_read: 0,
        receiver_read: 0
    });
    Data.StoreData('messages', messages);
}

function SetupConvo(data) {
    myNumber = Data.GetData('myNumber');
    contacts = Data.GetData('contacts');
    messages = Data.GetData('messages');

    $('#message-convo-container').data('data', data);

    let texts = messages.filter(c => c.sender == data.number && c.receiver == myNumber || c.sender == myNumber && c.receiver == data.number);
    let contact = contacts.filter(c => c.number == data.number)[0];

    if (contact != null) {
        $('.convo-action-addcontact').hide();
        $('.convo-top-number').html(contact.name);
        $('.convo-top-bar').attr('class', 'convo-top-bar other-' + contact.name[0]);
    } else {
        $('.convo-action-addcontact').show();
        $('.convo-top-number').html(data.number);
    }

    $('.convo-texts-list').html('');
    $.each(texts, function(index, text) {
        var d = new Date(text.sent_time);

        if (text.sender == myNumber) {
            $('.convo-texts-list').append('<div class="text me-sender"><span>' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>');

            // Just incase losers wanna send themselves a text
            if (text.receiver == myNumber) {
                if (contact != null) {
                    $('.convo-texts-list').append('<div class="text other-sender"><span class=" other-' + contact.name[0] + '">' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
                } else {
                    $('.convo-texts-list').append('<div class="text other-sender"><span>' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
                }
            }
        } else {
            if (contact != null) {
                $('.convo-texts-list').append('<div class="text other-sender"><span class=" other-' + contact.name[0] + '">' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
            } else {
                $('.convo-texts-list').append('<div class="text other-sender"><span>' + text.message + '</span><p>' + moment(d).fromNowOrNow() + '</p></div>')
            }
            
        }
    });

    if ($(".convo-texts-list .text:last-child").offset() != null) {
        $('.convo-texts-list').animate({
            scrollTop: $(".convo-texts-list .text:last-child").offset().top
        }, 25);
    }
}

function CloseConvo() {
    myNumber = null;
    contacts = null;
    messages = null;
    $('#message-convo-container').removeData('data');
    $('.convo-texts-list').html('');
    $('.convo-top-bar').attr('class', 'convo-top-bar');
}

export default { SetupConvo, CloseConvo, ReceiveText }