import fetch from "node-fetch"

export async function getChannels() {
  try {
    const res = await fetch("https://vavoo.to/channels")
    const json = await res.json()

    // Filtra solo i canali italiani
    const italian = json.filter(ch => ch.country === "Italy")

    return italian.map(ch => ({
      id: ch.id,
      name: ch.name,
      logo: ch.logo || null,
      group: ch.group || "Italy",
      country: ch.country,
      url: ch.url || null
    }))
  } catch (err) {
    console.error("Errore caricamento canali Vavoo:", err)
    return []
  }
}
