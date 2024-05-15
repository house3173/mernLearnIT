export const authReducer = (state, action) => {
    // destructing (phân rã action thành type và payload)
	const {type, payload: { isAuthenticated, user }} = action

	switch (type) {
		case 'SET_AUTH':
			return {
				...state,
				authLoading: false,
				isAuthenticated,
				user
			}

		default:
			return state
	}
}