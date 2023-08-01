export type DebugEvent<T = any> = {
	action: string
	data: T
}

export type VisibilityProviderValue = {
	setVisible: (visible: boolean) => void
	visible: boolean
	setOpacity: (opacity: number) => void
	opacity: MotionValue<number>
}

export type MenuProviderValue = {
	setMenu: (
		menu: {
			id: string
			location: {
				left: number
				top: number
			}
			options: TContextMenuOption[]
		} | null
	) => void
}

export type NuiMessageData<T = any> = DebugEvent

export type NuiHandlerSignature<T> = (data: T) => void
