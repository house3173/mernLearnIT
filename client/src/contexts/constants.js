export const apiUrl =
	process.env.NODE_ENV !== 'production'
		? 'http://localhost:3000/api'
		: 'some'

export const LOCAL_STORAGE_TOKEN_NAME = 'learnit-mern'