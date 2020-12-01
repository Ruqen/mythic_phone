Calls = {}

function CreateCallRecord(sender, receiver, state)

end

AddEventHandler('playerDropped', function()
    local cData = GetCharacter(source)
    if Calls[cData.phone] ~= nil then
        local tPlayer = exports['baseshit']:getIdentifierByPhoneNumber(Calls[cData.phone].number)
        if tPlayer ~= nil then
            local tPlayerSourceID = ESX.GetPlayerFromIdentifier(tPlayerId).source
            TriggerClientEvent('mythic_phone:client:EndCall', tPlayerSourceID)
        else
            Calls[Calls[cData.phone].number] = nil
        end
        Calls[cData.phone] = nil
    end
end)

RegisterServerEvent('esx:playerSpawned')
AddEventHandler('esx:playerSpawned', function()
    local src = source
    local cData = GetCharacter(source)

    Citizen.CreateThread(function()
        exports['ghmattimysql']:execute('SELECT * FROM phone_calls WHERE (sender = @number AND sender_deleted = 0) OR (receiver = @number AND receiver_deleted = 0) LIMIT 50', { ['number'] = cData.phone }, function(history) 
            TriggerClientEvent('mythic_phone:client:SetupData', src, { { name = 'history', data = history } })
        end)
    end)
end)

RegisterServerEvent('mythic_phone:server:DeleteCallRecord')
AddEventHandler('mythic_phone:server:DeleteCallRecord', function(token, identifier, id)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end

    local cData = GetCharacter(source)

    exports['ghmattimysql']:execute('SELECT * FROM phone_calls WHERE id = @id', { ['id'] = id }, function(record)
        if record[1] ~= nil then
            if record[1].sender == cData.phone then
                exports['ghmattimysql']:execute('UPDATE phone_calls SET sender_deleted = 1 WHERE id = @id AND sender = @phone', { ['id'] = id, ['phone'] = cData.phone }, function(status)
                    if status.affectedRows > 0 then
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
                    else
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
                    end
                end)
            else
                exports['ghmattimysql']:execute('UPDATE phone_calls SET receiver_deleted = 1 WHERE id = @id AND receiver = @phone', { ['id'] = id, ['phone'] = cData.phone }, function(status)
                    if status.affectedRows > 0 then
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, true)
                    else
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
                    end
                end)
            end
        else
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, false)
        end
    end)
end)

RegisterServerEvent('mythic_phone:server:CreateCall')
AddEventHandler('mythic_phone:server:CreateCall', function(token, identifier, number, nonStandard)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end

    local cData = GetCharacter(source)

    local tPlayerId = exports['baseshit']:getIdentifierByPhoneNumber(number)
    if tPlayer ~= nil then
        local tPlayerSourceID = ESX.GetPlayerFromIdentifier(tPlayerId).source
        if tPlayerSourceID ~= nil and tPlayerSourceID ~= src then
            if Calls[number] ~= nil then
                TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -3)
                TriggerClientEvent('mythic_notify:client:SendAlert', tPlayerSourceID, { type = 'inform', text = getFullName(cData) .. ' Tried Calling You, Sending Busy Response'})
            else
                exports['ghmattimysql']:execute('INSERT INTO phone_calls (sender, receiver, status, anon) VALUES(@sender, @receiver, @status, @anon)', {
                    ['sender'] = cData.phone,
                    ['receiver'] = number,
                    ['status'] = 0,
                    ['anon'] = nonStandard
                }, function(status)
                    if status.affectedRows > 0 then
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, 1)
        
                        TriggerClientEvent('mythic_phone:client:CreateCall', src, cData.phone)

                        if nonStandard then
                            TriggerClientEvent('mythic_phone:client:ReceiveCall', tPlayerSourceID, 'Anonymous Caller')
                            TriggerClientEvent('mythic_notify:client:PersistentAlert', tPlayerSourceID, { id = Config.IncomingNotifId, action = 'start', type = 'inform', text = 'Recieve A Call From A Hidden Number', style = { ['background-color'] = '#ff8555', ['color'] = '#ffffff' } })
                        else
                            TriggerClientEvent('mythic_phone:client:ReceiveCall', tPlayerSourceID, cData.phone)
                            TriggerClientEvent('mythic_notify:client:PersistentAlert', tPlayerSourceID, { id = Config.IncomingNotifId, action = 'start', type = 'inform', text = getFullName(cData) .. ' Is Calling You', style = { ['background-color'] = '#ff8555', ['color'] = '#ffffff' } })
                        end
                        
                        Calls[cData.phone] = {
                            number = number,
                            status = 0,
                            record = status.insertId
                        }
                        Calls[number] = {
                            number = cData.phone,
                            status = 0,
                            record = status.insertId
                        }
                    else
                        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -1)
                    end
                end)
            end
        else
            TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -2)
        end
    else
        TriggerClientEvent('mythic_phone:client:ActionCallback', src, identifier, -1)
    end
end)

RegisterServerEvent('mythic_phone:server:AcceptCall')
AddEventHandler('mythic_phone:server:AcceptCall', function(token)
    local src = source
    if not exports['salty_tokenizer']:secureServerEvent(GetCurrentResourceName(), src, token) then
		return false
    end

    local cData = GetCharacter(source)

    print(cData.phone)

    if Calls[cData.phone] ~= nil then
        local tPlayerId = exports['baseshit']:getIdentifierByPhoneNumber(Calls[cData.phone].number)
        if tPlayer ~= nil then
            local tPlayerSourceID = ESX.GetPlayerFromIdentifier(tPlayerId).source
            if (Calls[cData.phone].number ~= nil) and (Calls[Calls[cData.phone].number].number ~= nil) then
                Calls[Calls[cData.phone].number].status = 1
                Calls[cData.phone].status = 1

                TriggerClientEvent('mythic_phone:client:AcceptCall', src, (tPlayerSourceID + 100), false)
                TriggerClientEvent('mythic_phone:client:AcceptCall', tPlayerSourceID, (tPlayerSourceID + 100), true)
            else
                Calls[Calls[cData.phone].number] = nil
                Calls[cData.phone] = nil
                TriggerClientEvent('mythic_phone:client:EndCall', src)
                TriggerClientEvent('mythic_phone:client:EndCall', tPlayerSourceID)
            end
        else
            TriggerClientEvent('mythic_phone:client:EndCall', src)
        end
    end
end)

RegisterServerEvent('mythic_phone:server:EndCall')
AddEventHandler('mythic_phone:server:EndCall', function(token)
    local src = source
    local cData = GetCharacter(source)

    if Calls[cData.phone] ~= nil then
        local tPlayer = exports['baseshit']:getIdentifierByPhoneNumber(Calls[cData.phone].number)
        if tPlayer ~= nil then
            local tPlayerSourceID = ESX.GetPlayerFromIdentifier(tPlayerId).source
            Calls[Calls[cData.phone].number] = nil
            Calls[cData.phone] = nil

            TriggerClientEvent('mythic_phone:client:EndCall', src)
            TriggerClientEvent('mythic_phone:client:EndCall', tPlayerSourceID)
        end
    end
end)