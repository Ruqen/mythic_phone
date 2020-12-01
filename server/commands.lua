RegisterCommand("phone", function(source, args, rawCommand)
    TriggerClientEvent('mythic_phone:client:TogglePhone', source)
end)