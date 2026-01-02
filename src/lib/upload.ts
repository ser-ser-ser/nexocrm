import { createBrowserClient } from "@supabase/ssr"

/**
 * Uploads an array of files to a specific Supabase Storage bucket.
 * Returns an array of public URLs for the uploaded files.
 */
export async function uploadFiles(
    files: File[],
    bucket: string,
    folderPath: string = ""
): Promise<string[]> {
    if (!files || files.length === 0) return []

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        // Sanitize filename and add timestamp/random string for uniqueness
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = folderPath ? `${folderPath}/${fileName}` : fileName

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file)

        if (uploadError) {
            console.error(`Error uploading ${file.name}:`, uploadError)
            throw uploadError
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

        return publicUrl
    })

    return Promise.all(uploadPromises)
}
