import { useState } from 'react'

const useLetters = (letters: string[]) => {
	const [currentLetter, setCurrentLetter] = useState(
		letters[Math.floor(Math.random() * letters.length)]
	)
	const [isRed, setIsRed] = useState(Math.random() > 0.5)

	const newLetter = () => {
		const newLetter = letters[Math.floor(Math.random() * letters.length)]
		const newIsRed = Math.random() > 0.5
		setCurrentLetter(newLetter)
		setIsRed(newIsRed)
	}

	return { currentLetter, isRed, newLetter }
}

export default useLetters
