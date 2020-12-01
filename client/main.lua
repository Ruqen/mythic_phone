ESX = nil
local PlayerData = {}
local isLoggedIn = false
Callbacks = nil
actionCb = {}
isPhoneOpen = false

Citizen.CreateThread(function()
	while ESX == nil do
		TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
		Citizen.Wait(0)
	end

	while ESX.GetPlayerData().job == nil do
		Citizen.Wait(10)
	end

	ESX.PlayerData = ESX.GetPlayerData()
end)

RegisterNetEvent('mythic_phone:client:ActionCallback')
AddEventHandler('mythic_phone:client:ActionCallback', function(identifier, data)
  if actionCb[identifier] ~= nil then
    actionCb[identifier](data)
    actionCb[identifier] = nil
  end
end)

RegisterNetEvent('mythic_phone:client:TogglePhone')
AddEventHandler('mythic_phone:client:TogglePhone', function(identifier, data)
  TogglePhone()
end)

RegisterNetEvent('mythic_phone:client:SetupData')
AddEventHandler('mythic_phone:client:SetupData', function(data)
  SendNUIMessage({
    action = 'setup',
    data = data
  })
end)

function DrawUIText(text, font, centre, x, y, scale, r, g, b, a)
    SetTextFont(font)
    SetTextProportional(0)
    SetTextScale(scale, scale)
    SetTextColour(r, g, b, a)
    SetTextDropShadow(0, 0, 0, 0,255)
    SetTextEdge(1, 0, 0, 0, 255)
    SetTextDropShadow()
    SetTextOutline()
    SetTextCentre(centre)
    SetTextEntry("STRING")
    AddTextComponentString(text)
    DrawText(x , y) 
end

function CalculateTimeToDisplay()
  hour = GetClockHours()
  minute = GetClockMinutes()
  
  local obj = {}
  
  if hour <= 9 then
    hour = "0" .. hour
  end
  
  if minute <= 9 then
    minute = "0" .. minute
  end
  
  obj.hour = hour
  obj.minute = minute

  return obj
end

function hasPhone(cb)
  ESX.TriggerServerCallback("mythic_phone:hasItemCb", function(haveIt)
    if haveIt then
      cb(true)
    else
      cb(false)
    end
  end, "phone", 1)
end

function hasDecrypt(cb)
  ESX.TriggerServerCallback("mythic_phone:hasItemCb", function(haveIt)
    if haveIt then
      cb(true)
    else
      cb(false)
    end
  end, "decrypt", 1)
end
  
function toggleIrc(status)
  if not status then
    TriggerEvent('mythic_phone:client:setEnableApp', 'IRC', false)
  else
    TriggerEvent('mythic_phone:client:setEnableApp', 'IRC', true)
  end
end

function ShowNoPhoneWarning()
  exports.mythic_notify:SendAlert('inform', 'You dont have a phone buddy.')
end

RegisterNetEvent('esx:playerLoaded')
AddEventHandler('esx:playerLoaded', function(xPlayer)
  isLoggedIn = true

  local counter = 0
  Citizen.CreateThread(function()
    while isLoggedIn do
      if IsDisabledControlJustReleased(1, 170) then
        TogglePhone()
      end

      if counter <= 0 then
        local time = CalculateTimeToDisplay()
        SendNUIMessage({
          action = 'updateTime',
          time = time.hour .. ':' .. time.minute
        })
        counter = 100
      else
        counter = counter - 1
      end

      Citizen.Wait(-1)
    end
  end)
end)

function TogglePhone()
  if not openingCd or isPhoneOpen then
    isPhoneOpen = not isPhoneOpen
    if isPhoneOpen == true then
      hasPhone(function(hasPhone)
        if hasPhone then
          PhonePlayIn()
          SetNuiFocus(true, true)
          if Call ~= nil then
            SendNUIMessage( { action = 'show', number = Call.number, initiator = Call.initiator } )
          else
            SendNUIMessage( { action = 'show' } )
          end
          DisableControls()
        else
          isPhoneOpen = false
        end
      end)
    else
      SetNuiFocus(false, false)
      if not IsInCall() then
        PhonePlayOut()
      end
      SendNUIMessage( { action = 'hide' } )
    end

    openingCd = true
  end

  Citizen.CreateThread(function()
    Citizen.Wait(2000)
    openingCd = false
  end)
end

function ForceClosePhone()
  isPhoneOpen = false
  SetNuiFocus(isPhoneOpen, isPhoneOpen)
  if not IsInCall() then
    PhonePlayOut()
  end
  SendNUIMessage( { action = 'hide' } )
end

function DisableControls()
  Citizen.CreateThread(function()
      while isPhoneOpen do
          DisableControlAction(0, 1, true) -- LookLeftRight
          DisableControlAction(0, 2, true) -- LookUpDown
          DisableControlAction(0, 106, true) -- VehicleMouseControlOverride
          DisableControlAction(0, 30, true) -- disable left/right
          DisableControlAction(0, 31, true) -- disable forward/back
          DisableControlAction(0, 36, true) -- INPUT_DUCK
          DisableControlAction(0, 21, true) -- disable sprint
          DisableControlAction(0, 63, true) -- veh turn left
          DisableControlAction(0, 64, true) -- veh turn right
          DisableControlAction(0, 71, true) -- veh forward
          DisableControlAction(0, 72, true) -- veh backwards
          DisableControlAction(0, 75, true) -- disable exit vehicle

          DisablePlayerFiring(PlayerId(), true) -- Disable weapon firing
          DisableControlAction(0, 24, true) -- disable attack
          DisableControlAction(0, 25, true) -- disable aim
          DisableControlAction(1, 37, true) -- disable weapon select
          DisableControlAction(0, 47, true) -- disable weapon
          DisableControlAction(0, 58, true) -- disable weapon
          DisableControlAction(0, 140, true) -- disable melee
          DisableControlAction(0, 141, true) -- disable melee
          DisableControlAction(0, 142, true) -- disable melee
          DisableControlAction(0, 143, true) -- disable melee
          DisableControlAction(0, 263, true) -- disable melee
          DisableControlAction(0, 264, true) -- disable melee
          DisableControlAction(0, 257, true) -- disable melee
          Citizen.Wait(1)
      end
  end)
end

RegisterNUICallback("ClosePhone", function(data, cb)
  TogglePhone()
end)

RegisterNUICallback("ClearUnread", function(data, cb)
  UpdateAppUnread('messages', 0)
end)