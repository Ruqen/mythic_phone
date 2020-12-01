RegisterNUICallback('CreateContact', function( data, cb )
    actionCb['CreateContact'] = cb
    TriggerServerEvent('mythic_phone:server:CreateContact', securityToken, 'CreateContact', data.name, data.number)
end)

RegisterNUICallback('EditContact', function( data, cb )
    actionCb['EditContact'] = cb
    TriggerServerEvent('mythic_phone:server:EditContact', securityToken, 'EditContact', data.originName, data.originNumber, data.name, data.number)
end)

RegisterNUICallback('DeleteContact', function( data, cb )
    actionCb['DeleteContact'] = cb
    TriggerServerEvent('mythic_phone:server:DeleteContact', securityToken, 'DeleteContact', data.name, data.number)
end)