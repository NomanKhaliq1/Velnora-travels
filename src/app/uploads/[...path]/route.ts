import { promises as fs } from "node:fs";
import path from "node:path";
import { IMAGE_TYPES, UPLOAD_DIR } from "@/lib/uploads";

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const file = path.join(UPLOAD_DIR, ...parts);
  const type = IMAGE_TYPES[path.extname(file).toLowerCase()];

  if (!type || !file.startsWith(UPLOAD_DIR + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        // Upload names include a random suffix, so a file never changes behind a URL.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
