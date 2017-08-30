export const getNextKey = () => ({
    key: Math.random().toString(36).substring(7)
})

export default getNextKey
