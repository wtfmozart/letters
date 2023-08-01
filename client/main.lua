local currentCb = nil
--[[
	@params config: {
		lives: number,
		speed: number,
		maxScore: number,
		letters: ['A', 'S', 'D'],
	}
 ]]
local function start(config, cb)
	currentCb = cb
	SendNUIMessage({
		action = "START",
		data = {
			lives = config.lives or 3,
			speed = config.speed or 0.3,
			maxScore = config.maxScore or 4,
			letters = config.letters,
		}
	})
	SetNuiFocus(true, false)
end
exports("start", start)

RegisterNUICallback("GAME_OVER", function(result, cb)
	SendNUIMessage({
		action = "SET_VISIBLE",
		data = false
	})
	SetNuiFocus(false, false)
	if currentCb then
		currentCb(result)
		currentCb = nil
	end
	cb("ok")
end)
