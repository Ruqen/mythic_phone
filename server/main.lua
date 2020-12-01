ESX = nil 

TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

RegisterServerEvent('mythic_base:server:CharacterSpawned')
AddEventHandler('mythic_base:server:CharacterSpawned', function()
    local src = source
    local cData = GetCharacter(src)

    TriggerClientEvent('mythic_phone:client:SetupData', src, { { name = 'myNumber', data = cData.phoneNumber }, { name = 'apps', data = Config.Apps } })
end)

function GetCharacter(source)
    local xPlayer = ESX.GetPlayerFromId(source)
	local result = MySQL.Sync.fetchAll('SELECT * FROM users WHERE identifier = @identifier', {
		['@identifier'] = xPlayer.getIdentifier()
	})

    return result[1]
end

function getFullName(char)
    if char ~= nil then
        return char.firstname .. " " .. char.lastname
    end
end

function getFirstName(char)
    if char ~= nil then
        return char.firstname
    end
end

function getLastName(char)
    if char ~= nil then
        return char.lastname
    end
end