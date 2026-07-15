import { asyncHandler } from "../utils/asyncHandler.js";
import { getClientId } from "../utils/clientId.js";
import { toggleLike, recordShare } from "../services/videoService.js";

export const likeVideo = asyncHandler(async (req, res) => {
  const clientId = getClientId(req);
  const result = await toggleLike(Number(req.params.id), clientId);
  res.json({ success: true, data: result });
});

export const shareVideo = asyncHandler(async (req, res) => {
  const clientId = getClientId(req);
  const platform = req.body.platform || "link";
  const result = await recordShare(Number(req.params.id), clientId, platform);
  res.json({ success: true, data: result });
});
