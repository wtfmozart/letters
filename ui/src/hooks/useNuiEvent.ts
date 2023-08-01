import { MutableRefObject, useEffect, useRef } from 'react'
import { NuiHandlerSignature, NuiMessageData } from '@/typings'
import { noop } from '../utils/misc'

/**
 * A hook that manage events listeners for receiving data from the client scripts
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this hook
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 *   // whatever logic you want
 * })
 *
 **/

export const useNuiEvent = <T = any>(
	action: string,
	handler: (data: T) => void
) => {
	const savedHandler: MutableRefObject<NuiHandlerSignature<T>> = useRef(noop)

	useEffect(() => {
		savedHandler.current = handler
	}, [handler])

	useEffect(() => {
		const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
			const { action: eventAction, data } = event.data

			if (savedHandler.current) {
				if (eventAction === action) {
					savedHandler.current(data)
				}
			}
		}

		window.addEventListener('message', eventListener)

		return () => window.removeEventListener('message', eventListener)
	}, [action])
}
