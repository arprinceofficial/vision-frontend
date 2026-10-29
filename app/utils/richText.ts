/**
 * Utility functions for handling rich text and HTML content
 */

/**
 * Strips all HTML tags and decodes HTML entities into clean plain text.
 * Especially handles &nbsp;, multiple whitespaces, <br>, </p>, etc.
 */
export function stripHtmlToText(value: unknown): string {
    if (value === null || value === undefined) return ''
    const text = String(value)
    if (!text) return ''

    return text
        // Replace block and break tags with space
        .replace(/<(?:br|hr)\s*\/?>/gi, ' ')
        .replace(/<\/(?:p|div|li|h[1-6]|tr)>/gi, ' ')
        // Strip remaining HTML tags
        .replace(/<[^>]*>/g, ' ')
        // Decode common HTML entities
        .replace(/&nbsp;/gi, ' ')
        .replace(/&#160;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\u00A0/g, ' ')
        // Collapse multiple spaces into single space
        .replace(/\s+/g, ' ')
        .trim()
}

/**
 * Checks if a value contains HTML tags.
 */
export function isHtml(value: unknown): boolean {
    if (typeof value !== 'string') return false
    return /<[a-z][\s\S]*>/i.test(value)
}

/**
 * Cleans empty rich-text placeholders produced by Quill like <p><br></p> or whitespace.
 */
export function cleanRichTextHtml(value: unknown): string {
    if (value === null || value === undefined) return ''
    const text = String(value).trim()
    if (!text || text === '<p><br></p>' || text === '<p></p>' || text === '<br>' || text === '<br/>') {
        return ''
    }
    return text
}

/**
 * Splits HTML or plain text into individual paragraphs.
 */
export function htmlToParagraphs(value: unknown): string[] {
    if (!value) return []

    if (Array.isArray(value)) {
        return value
            .map((item: any) => {
                if (typeof item === 'string') return item.trim()
                const heading = item?.heading ? String(item.heading).trim() : ''
                const content = item?.content || item?.text || item?.description
                const contentStr = content ? String(content).trim() : ''
                return heading && contentStr ? `<strong>${heading}:</strong> ${contentStr}` : (contentStr || heading)
            })
            .filter((p) => p && p !== '<p><br></p>' && p !== '<p></p>')
    }

    if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed || trimmed === '<p><br></p>' || trimmed === '<p></p>') return []

        // If it contains paragraph or div tags, split by closing tag
        if (/<(?:p|div)[\s>]/i.test(trimmed)) {
            const parts = trimmed
                .replace(/<p[^>]*>/gi, '')
                .replace(/<div[^>]*>/gi, '')
                .split(/<\/(?:p|div)>/gi)
                .map((p) => p.trim())
                .filter((p) => p && p !== '<br>' && p !== '<br/>')

            if (parts.length) {
                return parts
            }
        }

        // Split by newlines if plain text
        const lines = trimmed
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean)

        return lines.length ? lines : [trimmed]
    }

    return []
}
