export default defineEventHandler(async (event) => {
    const { url } = getQuery(event)
    const documentUrlValue = Array.isArray(url) ? url[0] : url

    if (!documentUrlValue) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Document URL is required'
        })
    }

    let documentUrl
    try {
        documentUrl = new URL(String(documentUrlValue))
    } catch {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid document URL'
        })
    }

    const { API_URL_ADMIN, API_URL_CITIZEN } = useRuntimeConfig().public
    const allowedOrigins = [API_URL_ADMIN, API_URL_CITIZEN]
        .filter(Boolean)
        .map((baseUrl) => new URL(baseUrl).origin)

    if (!allowedOrigins.includes(documentUrl.origin) || !documentUrl.pathname.includes('/storage/documents/')) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Document URL is not allowed'
        })
    }

    const token = getCookie(event, 'XCTN-TOKEN')
    const response = await fetch(documentUrl.toString(), {
        headers: {
            accept: 'application/pdf',
            ...(token ? { authorization: `Bearer ${token}` } : {})
        }
    })

    if (!response.ok || !response.body) {
        throw createError({
            statusCode: response.status || 502,
            statusMessage: 'Unable to load document'
        })
    }

    return new Response(response.body, {
        headers: {
            'content-type': response.headers.get('content-type') || 'application/pdf',
            'cache-control': 'private, max-age=300',
            'content-disposition': 'inline'
        }
    })
})
