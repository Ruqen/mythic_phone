ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

ESX.RegisterServerCallback('mythic_phone:server:NewTweet', function(source, event, data)
    Citizen.CreateThread(function()
        local returnData = nil
        local char = GetCharacter(source)
        local author = char.firstname .. '_' .. char.firstname
        local message = data.message
        local mentions = data.mentions
        local hashtags = data.hashtags

        exports['ghmattimysql']:execute('INSERT INTO phone_tweets (`author`, `message`) VALUES(@author, @message)', { ['author'] = author, ['message'] = message }, function(status)
            if status.affectedRows > 0 then
                TriggerClientEvent('mythic_phone:client:RecieveNewTweet', -1, { author = author, message = message, mentions = mentions, hashtags = hashtags })
                returnData = true
            else
                returnData = false
            end
        end)

        while returnData == nil do
            Citizen.Wait(100)
        end

        return returnData
    end)
end)