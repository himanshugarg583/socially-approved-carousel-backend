import { asyncHandler } from "../utils/asyncHandler.js";
import { getClientId } from "../utils/clientId.js";
import { listVideos, getVideoById } from "../services/videoService.js";

export const getVideos = asyncHandler(async (req, res) => {
  const clientId = getClientId(req);
  const videos = await listVideos(clientId);
  res.json({ success: true, count: videos.length, data: videos });
});

export const getVideo = asyncHandler(async (req, res) => {
  const clientId = getClientId(req);
  const video = await getVideoById(Number(req.params.id), clientId);
  res.json({ success: true, data: video });
});
