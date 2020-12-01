import App from '../app';
import Config from '../config';
import Data from '../data';

var contacts = null;
var editingContact = null;

$('.contacts-list').on('click', '.contact', function(event) {
    if ($(this).find('.contact-actions').is(":visible")) {
        $(this).find('.contact-actions').slideUp();
    } else {
        $(this).parent().find('.contact-actions').slideUp();
        $(this).find('.contact-actions').slideDown();
    }
});

$('#search-contacts').on('keyup', function(e) {
    e.preventDefault();
    
    let searchVal = $(this).val();

    if (searchVal !== '') {
        $.each($(this).parent().parent().find('.contacts-list').children(), function(index, contact) {
            let data = $(contact).data('contact');
    
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

$("#contact-add-number").on('keydown', function(e) {
    switch (e.which) {
        case 8:
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 96:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
            break;
        default:
            e.preventDefault();
            break;
    }
});

$("#contact-edit-number").on('keydown', function(e) {
    switch (e.which) {
        case 8:
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 96:
        case 97:
        case 98:
        case 99:
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
            break;
        default:
            e.preventDefault();
            break;
    }
});

$('#contacts-add-contact').on('submit', function(e) {
    e.preventDefault();
    
    let data = $(this).serializeArray();

    let name = data[0].value;
    let number = data[1].value;

    $.post(Config.ROOT_ADDRESS + '/CreateContact', JSON.stringify({
        name: name,
        number: number,
    }), function(status) {
        if (status) {
            var modal = M.Modal.getInstance($('#add-contact-modal'));
            modal.close();

            if (contacts == null) {
                contacts = new Array();
            }

            contacts.push({ name: name, number: number, index: contacts.length });
            App.StoreData('contacts', contacts);
        
            $('.contacts-list').append('<div class="contact waves-effect"><div class="contact-avatar other-' + name[0].toString().toLowerCase() + '">' + name[0] + '</div><div class="contact-name"><div class="contact-name-text">' + name + '</div><div class="number">(' + number + ')</div></div><div class="contact-actions waves-effect"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms action-text"></i><i class="fas fa-user-edit action-edit modal-trigger" data-target="edit-contact-modal"></i><i class="fas fa-trash-alt action-delete"></i></div></div>');
            $('.contacts-list .contact:last-child').data('contact', { name: name, number: number, index: contacts.length - 1 });
        
            $('.contacts-list').animate({
                scrollTop: $(".contacts-list .contact:last-child").offset().top
            }, 2000);
            
            $('.contacts-list .contact:last-child').find('.contact-name').trigger('click');
            M.toast({html: 'Contact Added'});

            $('#contact-add-name').val('');
            $('#contact-add-name').next().removeClass('active');
            $('#contact-add-number').val('');
            $('#contact-add-number').next().removeClass('active');

        } else {
            M.toast({html: 'Error Adding Contact'});
        }
    });
});

$('#contacts-edit-contact').on('submit', function(e) {
    e.preventDefault();
    
    let data = $(this).serializeArray();
    let editingData = $(editingContact).data('contact');

    let name = data[0].value;
    let number = data[1].value;

    $.post(Config.ROOT_ADDRESS + '/EditContact', JSON.stringify({
        originName: editingData.name,
        originNumber: editingData.number,
        name: name,
        number: number
    }), function(status) {
        if (status) {
            var modal = M.Modal.getInstance($('#edit-contact-modal'));
            modal.close();

            contacts[editingData.index] = { name: name, number: number, index: editingData.index };
            App.StoreData('contacts', contacts);

            $(editingContact).html('<div class="contact-avatar other-' + name[0].toString().toLowerCase() + '">' + name[0] + '</div><div class="contact-name"><div class="contact-name-text">' + name + '</div><div class="number">(' + number + ')</div></div><div class="contact-actions"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms action-text"></i><i class="fas fa-user-edit action-edit modal-trigger" data-target="edit-contact-modal"></i><i class="fas fa-trash-alt action-delete"></i></div>')
            $(editingContact).data('contact', { name: name, number: number, index: editingData.index })
            
            $(editingContact).find('.contact-name').trigger('click');
            M.toast({html: 'Contact Updated'});

            $('#contact-edit-name').val('');
            $('#contact-edit-name').next().removeClass('active');
            $('#contact-edit-number').val('');
            $('#contact-edit-number').next().removeClass('active');
        } else {
            M.toast({html: 'Error Updating Contact'});
        }
    });
});

$('.contacts-list').on('click', 'contact-actions .action-call', function(e) {
    let data = $(this).parent().parent().data('contact');
    CreateCall(data.number, false, false);
})

$('.contacts-list').on('click', '.contact-actions .action-text', function(e) {
    let data = $(this).parent().parent().data('contact');
    App.OpenApp('message-convo', { number: data.number });
});

$('.contacts-list').on('click', '.contact-actions .action-edit', function(e) {
    let data = $(this).parent().parent().data('contact');

    editingContact = $(this).parent().parent()
    $('#contact-edit-name').val(data.name);
    $('#contact-edit-number').val(data.number);
    M.updateTextFields();
});

$('.contacts-list').on('click', '.contact-actions .action-delete', function(e) {
    let $elem = $(this)
    let data = $elem.parent().parent().data('contact');
    $.post(Config.ROOT_ADDRESS + '/DeleteContact', JSON.stringify({
        name: data.name,
        number: data.number
    }), function(status) {
        if (status) {
            $elem.parent().parent().fadeOut('normal', function() {
                $elem.parent().parent().remove();
            });
            
            M.toast({html: 'Contact Deleted'});

            contacts.splice(data.index, 1);
            App.StoreData('contacts', contacts);
        } else {
            M.toast({html: 'Error Deleting Contact'});
        }
    });
});

function SetupContacts() {
    contacts = Data.GetData('contacts');
    contacts.sort(SortContacts);
    $('.contacts-list').html('');
    $.each(contacts, function(index, contact) {
        $('.contacts-list').append('<div class="contact waves-effect"><div class="contact-avatar other-' + contact.name[0].toString().toLowerCase() + '">' + contact.name[0] + '</div><div class="contact-name"><div class="contact-name-text">' + contact.name + '</div><div class="number">(' + contact.number + ')</div></div><div class="contact-actions"><i class="fas fa-phone-volume action-call"></i><i class="fas fa-sms action-text"></i><i class="fas fa-user-edit action-edit  modal-trigger" data-target="edit-contact-modal"></i><i class="fas fa-trash-alt action-delete"></i></div></div>');
        contact.index = index;
        $('.contacts-list .contact:last-child').data('contact', contact);
    });
}

function SortContacts(a, b) {
    let nameA = a.name.toUpperCase();
    let nameB = b.name.toUpperCase();
    return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
}

export default { SetupContacts, SortContacts }