# Letters Minigame

A simple minigame for FiveM where letters fall from the top of the game container and the player has to press the corresponding key on the keyboard.

## Support

Join my [**Discord**](https://discord.gg/NMTY4aKftS) for support.

## Demo

![Letters Demo](https://cdn.discordapp.com/attachments/1135993516842029130/1135993585947381941/letters.gif)

## Installation

1. Clone the repository
2. Add the `letters` folder to your `resources` folder
3. Add `ensure letters` to your `server.cfg`

## Usage

To start the minigame, use the export `start` like so:

```lua
exports.letters:start({
	lives = 3, -- How many letters the player can miss
	speed = 0.3,
	maxScore = 4, -- How many letters the player has to type to win
	letters = {'A', 'S', 'D'}, -- Optional. Defaults to all letters
}, function(result)
	if result then
		-- The player won
	else
		-- The player lost
	end
end)
```
