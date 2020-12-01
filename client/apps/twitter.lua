-- RegisterNUICallback('NewTweet', function(data, cb)
--     Callbacks:ServerCallback('mythic_phone:server:NewTweet', { message = data.message, mentions = data.mentions, hashtags = data.hashtags }, function(status)
--         print('truuuuu')
--     end)
-- end)

RegisterNUICallback('NewTweet', function(data, cb)
    TriggerServerEvent('mythic_phone:server:NewTweet', data.message, data.mentions, data.hashtags)
end)