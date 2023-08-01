import { useDebugData } from '@/hooks/useDebugData'
import Letter from './Letter'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { fetchNui } from '@/utils/fetchNui'
import { useVisibility } from '@/providers/VisibilityProvider'
import { useNuiEvent } from '@/hooks/useNuiEvent'
import { debugData } from '@/utils/debugData'

debugData([
	{
		action: 'START',
		data: {
			lives: 3,
			speed: 0.3,
			maxScore: 4,
			letters: ['A', 'S', 'D'],
		},
	},
])
const defaultLetters = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
]

const Game = () => {
	useDebugData()
	const [lives, setLives] = useState(3)
	const [currentLane, setCurrentLane] = useState(0)
	const [speed, setSpeed] = useState(0.7)
	const [stop, setStop] = useState(true)
	const [load, setLoad] = useState(true)
	const [maxScore, setMaxScore] = useState(20)
	const score = useRef<number>(0)
	const outline = useMotionValue('#ffffff00')
	const [showResult, setShowResult] = useState({ show: false, result: false })
	const [letters, setLetters] = useState(defaultLetters)

	const visibilityCtx = useVisibility()

	useNuiEvent('START', (data: any) => {
		score.current = 0
		data.letters && setLetters(data.letters)
		setLoad(true)
		setStop(true)
		setShowResult({ show: false, result: false })
		setLives(data.lives)
		setSpeed(1 - data.speed)
		setMaxScore(data.maxScore)
		visibilityCtx.setVisible(true)
	})

	const onCorrect = () => {
		score.current += 1
		if (score.current === maxScore) {
			setStop(true)
			setShowResult({ show: true, result: true })
			return
		}
		let newLane = Math.floor(Math.random() * 3)
		while (newLane === currentLane) {
			newLane = Math.floor(Math.random() * 3)
		}
		setCurrentLane(newLane)
		animate(outline, ['rgb(34 197 94)', '#ffffff00'], {
			type: 'tween',
			duration: 1,
		})
	}

	const onWrong = () => {
		setLives(lives - 1)
		let newLane = Math.floor(Math.random() * 3)
		while (newLane === currentLane) {
			newLane = Math.floor(Math.random() * 3)
		}
		setCurrentLane(newLane)
		animate(outline, ['rgb(239 68 68)', '#ffffff00'], {
			type: 'tween',
			duration: 1,
		})
		if (lives - 1 === 0) {
			setStop(true)
			setShowResult({ show: true, result: false })
		}
	}

	const changeLane = () => {
		let newLane = Math.floor(Math.random() * 3)
		while (newLane === currentLane) {
			newLane = Math.floor(Math.random() * 3)
		}
		setCurrentLane(newLane)
	}

	const sendResult = (result: boolean) => {
		fetchNui('GAME_OVER', showResult.result)
		/* visibilityCtx.setVisible(false)
		debugData([
			{
				action: 'START',
				data: {
					lives: 3,
					speed: 2,
					maxScore: 20,
				},
			},
		]) */
	}

	return (
		<section className='flex h-screen w-screen items-center justify-center'>
			<motion.div
				style={{
					outlineStyle: 'solid',
					outlineColor: outline,
					outlineWidth: '3px',
					filter: 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.6))',
				}}
				className='relative grid h-96 w-96 grid-cols-3 grid-rows-1 overflow-hidden rounded-xl bg-primary text-white'>
				{!stop &&
					[0, 1, 2].map((lane) => {
						if (lane !== currentLane) return null
						return (
							<Letter
								key={lane}
								speed={speed}
								onCorrect={onCorrect}
								onWrong={onWrong}
								lane={lane}
								changeLane={changeLane}
								letters={letters}
							/>
						)
					})}
				<AnimatePresence>
					{load && (
						<Loader
							setLoad={setLoad}
							setStop={setStop}
						/>
					)}
					{showResult.show && (
						<motion.div
							variants={{
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								exit: { opacity: 0 },
							}}
							initial='initial'
							animate='animate'
							exit='exit'
							onAnimationComplete={(definition) => {
								if (definition === 'animate') {
									setTimeout(() => {
										sendResult(showResult.result)
									}, 2000)
								}
							}}
							className='absolute inset-0 flex items-center justify-center font-bold'>
							<p
								className={`${
									showResult.result
										? 'text-green-400'
										: 'text-red-400'
								}`}>
								{showResult.result
									? 'System Override Successful!'
									: 'System Override Failed!'}
							</p>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</section>
	)
}

const Loader = ({
	setLoad,
	setStop,
}: {
	setLoad: (state: boolean) => void
	setStop: (state: boolean) => void
}) => {
	return (
		<motion.div
			exit={{ opacity: 0, transition: { duration: 0.3 } }}
			className='absolute col-span-3 flex h-full w-full flex-col items-center justify-center px-20'>
			<motion.svg
				width='100%'
				height='40'
				version='1.1'>
				<motion.line
					variants={{
						initial: {
							strokeWidth: 0,
						},
						animate: {
							strokeWidth: 2,
							transition: {
								duration: 0.3,
								type: 'tween',
							},
						},
						exit: {
							strokeWidth: 0,
							transition: { duration: 0.3 },
						},
					}}
					initial='initial'
					animate='animate'
					exit='exit'
					x1='2%'
					y1='50%'
					x2='98%'
					y2='50%'
					fill='transparent'
					stroke='#4b5563'
					strokeLinecap='round'
				/>
				<motion.line
					style={{
						filter: 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.2))',
					}}
					variants={{
						initial: {
							strokeWidth: 0,
							pathLength: 0.001,
							stroke: '#ffffff',
						},
						animate: {
							strokeWidth: 4,
							pathLength: 1,
							stroke: '#ffffff',
							transition: {
								strokeWidth: {
									delay: 0.3,
									duration: 0.2,
								},
								default: {
									delay: 0.7,
									duration: 4.3,
								},
							},
						},
					}}
					initial='initial'
					animate='animate'
					onAnimationComplete={(definition) => {
						if (definition === 'animate') {
							setLoad(false)
							setStop(false)
						}
					}}
					exit={{ strokeWidth: 0 }}
					x1='2%'
					y1='50%'
					x2='98%'
					y2='50%'
					fill='transparent'
					strokeLinecap='round'
				/>
			</motion.svg>
			<p className='text-sm font-bold'>Initiating System Override...</p>
		</motion.div>
	)
}

export default Game
