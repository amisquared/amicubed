export default defineEventHandler(async (event) => {
    setResponseStatus(event, 204)
    return { success: true}
})