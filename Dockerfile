# Nutze das Basis-Image Ubuntu
FROM ubuntu:latest

# Aktualisiere Paketliste und installiere notwendige Pakete
RUN apt-get update && \
    apt-get install -y curl make gcc g++ bash && \
    apt-get clean

# Installiere Node.js und npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere alle Dateien ins Image
COPY ./ /app

# Installiere Abhängigkeiten
RUN npm install

# Setze bash als Standardbefehl
CMD ["bash"]