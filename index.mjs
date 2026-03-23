import { addonBuilder } from "https://esm.sh/stremio-addon-sdk@1.6.0"

const manifest = {
  id: "community.vavoo.italy",
  version: "1.0.0",
  name: "Vavoo Italy Live TV",
  description: "Replica solo i canali italiani da https://vavoo.to/channels",
  types: ["tv"],
  catalogs: [
    {
      type: "tv",
      id: "vavoo_it_catalog",
      name: "Vavoo Italy"
    }
  ],
  resources: ["catalog", "stream"]
}

const builder = new addonBuilder(manifest)

let cachedChannels = null

async function loadChannels() {
  if (cachedChannels) return cachedChannels

  try {
    const res = await fetch("https://vavoo.to/channels")
    const json = await res.json()

    cachedChannels = json
      .filter(ch => ch.country === "Italy")
      .map(ch => ({
        id: ch.id,
        name: ch.name,
        logo: ch.logo || null,
        group: ch.group || "Italy",
        url: ch.url || null
      }))

    return cachedChannels
  } catch (err) {
    console.error("Errore caricamento canali Vavoo:", err)
    return []
  }
}

builder.defineCatalogHandler(async () => {
  const channels = await loadChannels()

  const metas = channels.map(ch => ({
    id: "vavoo_" + ch.id,
    type: "tv",
    name: ch.name,
    poster: ch.logo,
    genres: [ch.group],
    description: "Canale italiano importato da Vavoo"
  }))

  return { metas }
})

builder.defineStreamHandler(async ({ id }) => {
  const realId = id.replace("vavoo_", "")
  const channels = await loadChannels()
  const channel = channels.find(c => c.id == realId)

  if (!channel) return { streams: [] }

  if (channel.url) {
    return {
      streams: [{
        title: channel.name,
        url: channel.url
      }]
    }
  }

  return {
    streams: [{
      title: channel.name,
      url: `https://vavoo.to/play/${realId}/index.m3u8`
    }]
  }
})

const addonInterface = builder.getInterface()

// 🚀 DENO DEPLOY SERVER
Deno.serve(req => addonInterface(req))
