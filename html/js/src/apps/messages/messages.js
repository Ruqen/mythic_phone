import App from '../../app';
import Config from '../../config';
import Utils from '../../utils';
import Data from '../../data';
import Convo from './convo';

var myNumber = null;
var contacts = null;
var messages = null;

$('.messages-list').on('click', '.message', function(e) {
    App.OpenApp('message-convo', $(this).data('message'));
});

$('#message-new-contact').on('change', function(e) {
    let data = $(this).val();
    $('#message-new-number').val(data);
});

$('#message-new-msg').on('submit', function(e) {
    e.preventDefault();
    let data = $(this).serializeArray();

    SendNewText(data, function(sent) {
        if (sent) {
            var modal = M.Modal.getInstance($('#messages-new-modal'));
            modal.close();
        
            M.toast({html: 'Message Sent'});
        
            RefreshApp();
        }
    });
});

function SetupMessages() {
    myNumber = Data.GetData('myNumber');
    contacts = Data.GetData('contacts');
    messages = Data.GetData('messages');

    $.post(Config.ROOT_ADDRESS + '/ClearUnread', JSON.stringify({
        app: 'messages'
    }));

    let convos = new Array();

    $.each(messages, function(index, message) {
        let obj = new Object();

        if (message.sender == myNumber) {
            obj.number = message.receiver;
        } else {
            obj.number = message.sender;
        }

        obj.message = message.message;
        obj.receiver = message.receiver;
        obj.sender = message.sender;
        
        obj.time = new Date(message.sent_time);

        let convo = convos.filter(c => c.number === obj.number)[0]
        
        if (convo == null) {
            convos.push(obj);
        } else {
            if ( obj.time > convo.time ) {
                $.each(convos, function(index, c) {
                    if (c == convo) {
                        convos[index] = obj;
                    }
                })
                convos[convo.number] = obj;
            }
        }
    });

    convos.sort(Utils.DateSortNewest);

    $('#message-container .inner-app .messages-list').html('');
    $.each(convos, function(index, message) {
        let contact = null;
        if (contacts != null) {
            contact = contacts.filter(c => c.number == message.number)[0];
        } else {
        }

        // Not A Contact
        if (contact == null) {
            $('#message-container .inner-app .messages-list').append('<div class="message waves-effect"><div class="text-avatar">#</div><div class="text-name">' + message.number + '</div><div class="text-message">' + message.message + '</div><div class="text-time">' + moment(message.time).fromNowOrNow() + '</div></div>');
        } else {
            $('#message-container .inner-app .messages-list').append('<div class="message waves-effect"><div class="text-avatar other-' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div><div class="text-name">' + contact.name + '</div><div class="text-message"> ' + message.message + '</div><div class="text-time">' + moment(message.time).fromNowOrNow() + '</div></div>')
        }

        $('.messages-list .message:last-child').data('message', message);
    });
}

function SetupNewMessage() {
    $('#message-new-contact').html('');
    $('#message-new-contact').append('<option value="">Choose Contact</option>');
    $.each(contacts, function(index, contact) {
        $('#message-new-contact').append('<option value="' + contact.number + '">' + contact.name + ' (' + contact.number +')</option>');
    });

    $('#message-new-number').val('');
    $('#message-new-body').val('');

    $('#message-new-contact').formSelect();
}

function SendNewText(data, cb) {
    $.post(Config.ROOT_ADDRESS + '/SendText', JSON.stringify({
        receiver: data[0].value,
        message: data[1].value,
    }), function(textData) {
        if (textData != null) {
            if (messages == null) {
                messages = new Array();
            }

            messages.push({
                sender: myNumber,
                receiver: textData.receiver,
                message: textData.message,
                sent_time: textData.sent_time,
                sender_read: 0,
                receiver_read: 0
            });

            Data.StoreData('messages', messages);

            cb(true);
        } else {
            M.toast({html: 'Unable To Send Text'});

            cb(false);
        }
    });
}

export default { SetupMessages, SetupNewMessage, SendNewText, Convo }