import {
	animate,
	motion,
	useAnimationControls,
	useMotionValue,
} from 'framer-motion'
import React, {
	Context,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react'
import { useNuiEvent } from '../hooks/useNuiEvent'
import { VisibilityProviderValue } from '../typings'
import { fetchNui } from '../utils/fetchNui'
import { isEnvBrowser } from '../utils/misc'

const VisibilityCtx = createContext<VisibilityProviderValue | null>(null)

// This should be mounted at the top level of your application, it is currently set to
// apply a CSS visibility value. If this is non-performant, this should be customized.
export const VisibilityProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [visible, setVisible] = useState(false)
	const [hidden, setHidden] = useState(false)
	const opacityController = useAnimationControls()
	const opacity = useMotionValue(0)

	useNuiEvent<boolean>('SET_VISIBLE', setVisible)
	useNuiEvent<number>('SET_OPACITY', (value: number) =>
		animate(opacity, value)
	)

	// Handle pressing escape/backspace
	useEffect(() => {
		// Only attach listener when we are visible
		if (!visible) {
			opacityController.start('hidden')
			return
		}
		setHidden(false)
		opacityController.start('visible')
	}, [visible])

	return (
		<VisibilityCtx.Provider
			value={{
				visible,
				setVisible,
				opacity,
				setOpacity: (value: number) => animate(opacity, value),
			}}>
			<motion.div
				className='flex items-center justify-center'
				initial='hidden'
				style={{
					visibility: hidden ? 'hidden' : 'visible',
					height: '100vh',
					width: '100vw',
					opacity,
				}}
				animate={opacityController}
				variants={{
					hidden: { opacity: 0 },
					visible: { opacity: 1 },
				}}
				onAnimationComplete={(definition) => {
					if (definition === 'hidden') setHidden(true)
				}}
				transition={{
					duration: 0.2,
					type: 'tween',
					ease: 'easeOut',
				}}>
				{children}
			</motion.div>
		</VisibilityCtx.Provider>
	)
}

export const useVisibility = () =>
	useContext<VisibilityProviderValue>(
		VisibilityCtx as Context<VisibilityProviderValue>
	)
