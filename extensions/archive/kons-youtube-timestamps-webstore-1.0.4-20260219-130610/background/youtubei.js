const INNERTUBE_CLIENT_VERSION = "2.20211129.09.00";
const timestampRegex = /(\d{1,}):([0-5]\d)(?::([0-5]\d))?/;
const timestampGlobalRegex = /(\d{1,}):([0-5]\d)(?::([0-5]\d))?/g;

export async function fetchCommentsPage(videoId, continuationToken = null) {
  let token = continuationToken;

  if (!token) {
    const videoData = await fetchVideo(videoId);
    token = commentsContinuationToken(videoData);
  }

  if (!token) {
    return { comments: [], nextToken: null };
  }

  await new Promise((resolve) => setTimeout(resolve, 120));
  const response = await fetchNext(token);

  let nextToken = null;
  const parsedComments = [];

  const continuationItems =
    response.onResponseReceivedEndpoints[0]?.appendContinuationItemsAction?.continuationItems ||
    response.onResponseReceivedEndpoints[1]?.reloadContinuationItemsCommand?.continuationItems;

  if (!continuationItems) {
    return { comments: [], nextToken: null };
  }

  for (const item of continuationItems) {
    if (item.commentThreadRenderer) {
      const thread = item.commentThreadRenderer;

      if (thread.comment) {
        const renderer = thread.comment.commentRenderer;
        const text = renderer.contentText.runs.map((part) => part.text).join("");
        const timestamps = extractAllTimestamps(text);
        if (timestamps.length === 0) {
          continue;
        }
        const sourceId = renderer.commentId;
        const baseComment = {
          sourceId,
          name: renderer.authorText.simpleText,
          avatar: renderer.authorThumbnail.thumbnails[0].url,
          text,
          likes: parseLikeCount(renderer.voteCount?.simpleText),
          timestamps
        };
        timestamps.forEach((time) => {
          parsedComments.push({
            ...baseComment,
            id: `${sourceId}::${time}`,
            time
          });
        });
      } else if (thread.commentViewModel) {
        const viewModel = thread.commentViewModel.commentViewModel;
        const mutation = response.frameworkUpdates.entityBatchUpdate.mutations.find(
          (entry) => entry.entityKey === viewModel.commentKey
        );

        if (!mutation?.payload?.commentEntityPayload) {
          continue;
        }

        const payload = mutation.payload.commentEntityPayload;
        const text = payload.properties.content.content;
        const timestamps = extractAllTimestamps(text);
        if (timestamps.length === 0) {
          continue;
        }
        const sourceId = payload.properties.commentId;
        const baseComment = {
          sourceId,
          name: payload.author.displayName,
          avatar: payload.author.avatarThumbnailUrl,
          likes: parseLikeCount(payload.toolbar.likeCountLiked),
          text,
          timestamps
        };
        timestamps.forEach((time) => {
          parsedComments.push({
            ...baseComment,
            id: `${sourceId}::${time}`,
            time
          });
        });
      }
    } else if (item.continuationItemRenderer) {
      nextToken =
        item.continuationItemRenderer.continuationEndpoint.continuationCommand.token || null;
    }
  }

  return { comments: parsedComments, nextToken };
}

function commentsContinuationToken(videoPayload) {
  const response = Array.isArray(videoPayload)
    ? videoPayload.find((entry) => entry.response).response
    : videoPayload.response;

  return response.contents.twoColumnWatchNextResults.results.results.contents.find(
    (entry) =>
      entry.itemSectionRenderer &&
      entry.itemSectionRenderer.sectionIdentifier === "comment-item-section"
  ).itemSectionRenderer.contents[0].continuationItemRenderer?.continuationEndpoint.continuationCommand.token;
}

async function fetchVideo(videoId) {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}&pbj=1`, {
    credentials: "omit",
    headers: {
      "X-Youtube-Client-Name": "1",
      "X-Youtube-Client-Version": INNERTUBE_CLIENT_VERSION
    }
  });
  return response.json();
}

async function fetchNext(token) {
  const body = JSON.stringify({
    context: {
      client: {
        clientName: "WEB",
        clientVersion: INNERTUBE_CLIENT_VERSION
      }
    },
    continuation: token
  });

  const response = await fetch(
    "https://www.youtube.com/youtubei/v1/next?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
    {
      method: "POST",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json"
      },
      body
    }
  );

  return response.json();
}

function getTimeInSeconds(text) {
  try {
    const timestamp = text.match(timestampRegex)?.[0];
    if (!timestamp) {
      return null;
    }
    const parts = timestamp.split(":").reverse();

    let total = 0;
    if (parts[0]) {
      total += parseInt(parts[0], 10);
    }
    if (parts[1]) {
      total += parseInt(parts[1], 10) * 60;
    }
    if (parts[2]) {
      total += parseInt(parts[2], 10) * 3600;
    }

    return total;
  } catch (error) {
    return null;
  }
}

function extractAllTimestamps(text) {
  if (!text) {
    return [];
  }
  const matches = text.match(timestampGlobalRegex);
  if (!matches || matches.length === 0) {
    return [];
  }
  const unique = new Set();
  for (const rawTimestamp of matches) {
    const seconds = getTimeInSeconds(rawTimestamp);
    if (seconds !== null && seconds !== undefined) {
      unique.add(seconds);
    }
  }
  return [...unique].sort((a, b) => a - b);
}

function parseLikeCount(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }
  if (value === null || value === undefined) {
    return 0;
  }

  const raw = String(value).trim();
  if (!raw) {
    return 0;
  }

  const compact = raw.replace(/[\s\u00A0]/g, "");
  const shorthandMatch = compact.match(/^([\d.,]+)([KMB])$/i);
  if (shorthandMatch) {
    let numericPart = shorthandMatch[1];
    const suffix = shorthandMatch[2].toUpperCase();
    if (numericPart.includes(",") && !numericPart.includes(".")) {
      numericPart = numericPart.replace(",", ".");
    } else {
      numericPart = numericPart.replace(/,/g, "");
    }
    const base = parseFloat(numericPart);
    if (!Number.isFinite(base)) {
      return 0;
    }
    const multiplier = suffix === "K" ? 1_000 : suffix === "M" ? 1_000_000 : 1_000_000_000;
    return Math.max(0, Math.round(base * multiplier));
  }

  const plain = compact.replace(/,/g, "");
  const numeric = parseInt(plain, 10);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
}
