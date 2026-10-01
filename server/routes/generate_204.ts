export default defineEventHandler(async (event) => {
    setResponseStatus(event, 218)
    return { success: true}
})