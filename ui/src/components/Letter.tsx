import useLetters from '@/hooks/useLetters'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const Letter = ({
	speed,
	onCorrect,
	onWrong,
	lane,
	changeLane,
	letters,
}: {
	speed: number
	onCorrect: () => void
	onWrong: () => void
	lane: number
	changeLane: () => void
	letters: string[]
}) => {
	const { currentLetter, isRed, newLetter } = useLetters(letters)

	useEffect(() => {
		const keyListener = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === currentLetter.toLowerCase()) {
				if (isRed) {
					onWrong()
					setTimeout(() => newLetter(), 0)
				} else {
					onCorrect()
					setTimeout(() => newLetter(), 0)
				}
			}
		}

		window.addEventListener('keypress', keyListener)

		return () => {
			window.removeEventListener('keypress', keyListener)
		}
	}, [currentLetter, lane, isRed])

	return (
		<div
			className={`${
				lane === 0
					? 'col-start-1'
					: lane === 1
					? 'col-start-2'
					: 'col-start-3'
			} flex w-full justify-center`}>
			<motion.span
				key={lane}
				variants={{
					start: {
						y: 0,
					},
					end: {
						y: '100%',
					},
				}}
				initial='start'
				animate='end'
				onAnimationComplete={(definition) => {
					if (definition === 'end') {
						if (!isRed) onWrong()
						changeLane()
						newLetter()
					}
				}}
				transition={{
					duration: speed,
					type: 'tween',
					ease: 'linear',
				}}
				className={`${isRed && 'text-red-400'} text-3xl font-bold`}>
				{currentLetter}
			</motion.span>
		</div>
	)
}

export default Letter
