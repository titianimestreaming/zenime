// src/utils/getStreamInfo.utils.js

const getStreamInfo = async (animeId, episodeId, server = "hd-1", type = "sub") => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "https://api-zenime.vercel.app";

  try {
    // FIXED: backend expects the episode number INSIDE the id parameter → one-piece-100?ep=2142
    const url = new URL(`${API_URL}/api/stream`);
    url.searchParams.append("id", `${animeId}?ep=${episodeId}`);
    url.searchParams.append("server", server);
    url.searchParams.append("type", type);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Vercel/Netlify sometimes need this for cold starts
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Stream data not successful");
    }

    // The original hook expects data.results
    return data.results;
  } catch (error) {
    console.error("getStreamInfo error:", error);
    throw error; // let the hook handle the error state
  }
};

export default getStreamInfo;
