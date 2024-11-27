import { NextResponse } from "next/server";
import ytdl from "ytdl-core";
import { Readable } from "stream";

function readableToWebReadable(nodeStream: Readable): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const format = searchParams.get("format") || "video";
  const quality = searchParams.get("quality") || "highest";

  if (!url || !ytdl.validateURL(url)) {
    return NextResponse.json({ error: "Invalid or unsupported YouTube URL" }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, "_");

    const headers = new Headers({
      "Content-Disposition": `attachment; filename="${title}.${format === "audio" ? "mp3" : "mp4"}"`,
    });

    const nodeStream = ytdl(url, {
      filter: format === "audio" ? "audioonly" : "video",
      quality,
    });

    const webStream = readableToWebReadable(nodeStream);

    return new NextResponse(webStream, { headers });
  } catch (error) {
    console.error("Error during video processing:", error);
    return NextResponse.json(
      { error: "Failed to process the video. Please try again later." },
      { status: 500 }
    );
  }
}
