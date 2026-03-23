FROM node:20-alpine

# Crea la cartella dell'app
WORKDIR /usr/src/app

# Copia solo package per sfruttare la cache
COPY package.json package-lock.json* ./

RUN npm install --production

# Copia il resto dei file
COPY . .

# Porta su cui esporrai l'addon (puoi cambiarla nel codice se vuoi)
ENV PORT=7000

EXPOSE 7000

CMD ["node", "index.mjs"]
