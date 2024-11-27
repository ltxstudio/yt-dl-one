import { NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const format = searchParams.get("format") || "video";
  const quality = searchParams.get("quality") || "highest";

  if (!url || !ytdl.validateURL(url)) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");

    const headers = new Headers({
      "Content-Disposition": `attachment; filename="${title}.${format === "audio" ? "mp3" : "mp4"}"`,
    });

    const stream = ytdl(url, {
      filter: format === "audio" ? "audioonly" : "video",
      quality,
    });

    // TypeScript requires a proper type for the stream. Use `NodeJS.ReadableStream`.
    return new NextResponse(stream as unknown as ReadableStream, { headers });
  } catch {
    return NextResponse.json({ error: "Failed to process the video" }, { status: 500 });
  }
}
