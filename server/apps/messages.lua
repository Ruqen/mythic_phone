RegisterServerEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function()
    local src = source
    local cData = GetCharacter(source)

    Citizen.CreateThread(function()
        exports['ghmattimysql']:execute('SELECT * FROM phone_texts WHERE (sender = @number AND sender_deleted = 0) OR (receiver = @number AND receiver_deleted = 0)', { ['number'] = cData.phone }, function(messages) 
            TriggerClientEvent('mythic_phone:client:SetupData', src, { { name = 'messages', data = messages } })
        end)
    end)
end)

RegisterServerEvent('mythic_phone:server:SendText')
AddEventHandler('mythic_phone:server:SendText', function(token, identifier, receiver, message)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end
    
    local cData = GetCharacter(source)

    Citizen.CreateThread(function()
        exports['ghmattimysql']:execute('INSERT INTO phone_texts (`sender`, `receiver`, `message`) VALUES(@sender, @receiver, @message)', { ['sender'] = cData.phone, ['receiver'] = receiver, ['message'] = message }, function(status)
            if status.affectedRows > 0 then
                exports['ghmattimysql']:execute('SELECT * FROM phone_texts WHERE id = @id', { ['id'] = status.insertId }, function(text)
                    if text[1] ~= nil then
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, text[1])

                        local tPlayer = exports['baseshit']:getIdentifierByPhoneNumber(receiver)
                        if tPlayer ~= nil then
                            local tPlayerSourceID = ESX.GetPlayerFromIdentifier(tPlayerId).source
                            exports['ghmattimysql']:execute('SELECT * FROM phone_contacts WHERE number = @number AND charid = @charid', { ['number'] = cData.phone, ['charid'] = tPlayerId }, function(contact)
                                if contact[1] ~= nil then
                                    TriggerClientEvent('mythic_phone:client:ReceiveText', tPlayerSourceID, contact[1].name, text[1])
                                else
                                    TriggerClientEvent('mythic_phone:client:ReceiveText', tPlayerSourceID, cData.phone, text[1])
                                end
                            end)
                        end
                    else
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
                    end
                end)
            else
                TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
            end
        end)
    end)
end)

RegisterServerEvent('mythic_phone:server:DeleteConversation')
AddEventHandler('mythic_phone:server:DeleteConversation', function(token, identifier, number)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end

    local cData = GetCharacter(source)

    exports['ghmattimysql']:execute('UPDATE phone_texts SET sender_deleted = 1 WHERE sender = @me AND receiver = @other', { ['me'] = cData.phone, ['other'] = number }, function(status1)
        exports['ghmattimysql']:execute('UPDATE phone_texts SET receiver_deleted = 1 WHERE receiver = @me AND sender = @other', { ['me'] = cData.phone, ['other'] = number }, function(status2)
            if status1 ~= nil and status2 ~= nil then
                TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
            else
                TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
            end
        end)
    end)
end)