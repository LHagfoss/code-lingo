import { createClient } from "@supabase/supabase-js";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
};

async function getImageExtension(file: File) {
    if (!file.size || file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new Error("Images must be smaller than 5 MB.");
    }

    const extension = IMAGE_EXTENSIONS[file.type];
    if (!extension) {
        throw new Error("Use a JPEG, PNG, WebP, or GIF image.");
    }

    const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const header = String.fromCharCode(...bytes);
    const matchesType =
        (file.type === "image/gif" && /^GIF8[79]a/.test(header)) ||
        (file.type === "image/jpeg" &&
            bytes[0] === 0xff &&
            bytes[1] === 0xd8 &&
            bytes[2] === 0xff) ||
        (file.type === "image/png" &&
            [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
                (byte, index) => bytes[index] === byte,
            )) ||
        (file.type === "image/webp" &&
            header.startsWith("RIFF") &&
            header.slice(8, 12) === "WEBP");

    if (!matchesType) {
        throw new Error(
            "The file contents do not match the selected image type.",
        );
    }

    return extension;
}

function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error("Missing Supabase environment variables");
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey);
}

export async function uploadImage(file: File, bucket: string, path: string) {
    const extension = await getImageExtension(file);
    const safePath = `${path.replace(/\.[^.]+$/, "")}.${extension}`;
    const supabase = getAdminClient();

    // convert File to ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error } = await supabase.storage
        .from(bucket)
        .upload(safePath, buffer, {
            contentType: file.type,
            upsert: true,
        });

    if (error) {
        console.error("Upload Error:", error);
        throw new Error("Failed to upload image");
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(safePath);

    return publicUrl;
}
