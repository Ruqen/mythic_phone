RegisterNetEvent('mythic_phone:client:ReceiveText')
AddEventHandler('mythic_phone:client:ReceiveText', function(sender, text)
    TriggerServerEvent('InteractSound_SV', 10.0, 'text_message', 0.05)
    exports['mythic_notify']:SendAlert('inform', 'You Received A Text From ' .. sender)

    SendNUIMessage({
        action = 'receiveText',
        data = {
            sender = sender,
            text = text
        }
    })

    if not isPhoneOpen then
        local app = GetAppData('messages')
        UpdateAppUnread('messages', app.unread + 1)
    end
end)

RegisterNUICallback( 'SendText', function( data, cb )
    actionCb['SendText'] = cb
    TriggerServerEvent('mythic_phone:server:SendText', securityToken, 'SendText', data.receiver, data.message)
end)

RegisterNUICallback( 'DeleteConversation', function( data, cb )
    actionCb['DeleteConversation'] = cb
    TriggerServerEvent('mythic_phone:server:DeleteConversation', securityToken, 'DeleteConversation', data.number)
end)
