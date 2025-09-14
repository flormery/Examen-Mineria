from bs4 import BeautifulSoup
import httpx
from supabase import create_client, Client
import time

# ==============================
# Conexión Supabase
# ==============================
url = "https://aswmdmtkpjrrckhwcqlw.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzd21kbXRrcGpycmNraHdjcWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODQ1ODEsImV4cCI6MjA3MzI2MDU4MX0.VWOZB2ZBhO0VZtHba68jzC0ZD2FKeMBOcrTds9zOM6w"
supabase: Client = create_client(url, key)

# ==============================
# Función segura de request con httpx
# ==============================
def safe_request(url, retries=3):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/120.0.0.0 Safari/537.36"
    }
    for i in range(retries):
        try:
            with httpx.Client(headers=headers, timeout=15, follow_redirects=True) as client:
                r = client.get(url)
                if r.status_code == 200:
                    return r
        except Exception as e:
            print(f"⚠️ Error de conexión ({e}), reintentando {i+1}/{retries}...")
            time.sleep(2)
    return None

# ==============================
# Scraper con Supabase
# ==============================
def guardar_noticias(diario, base_url, url_portada, selector_titulo):
    print(f"\n📌 Extrayendo noticias de {diario} ...")
    try:
        response = safe_request(url_portada)
        if not response:
            print(f"❌ No se pudo acceder a {url_portada}")
            return

        soup = BeautifulSoup(response.text, "html.parser")

        enlaces = []
        for a in soup.select(selector_titulo):
            if a.has_attr("href"):
                href = a["href"]
                if href.startswith("http"):
                    enlaces.append(href)
                else:
                    enlaces.append(base_url + href)

        enlaces = list(set(enlaces))  # quitar duplicados

        for link in enlaces[:5]:
            try:
                r = safe_request(link)
                if not r:
                    print(f"❌ No se pudo acceder a {link}")
                    continue

                s = BeautifulSoup(r.text, "html.parser")

                titulo = s.find("h1").get_text(strip=True) if s.find("h1") else "Sin título"
                fecha = s.find("time").get("datetime", "Fecha no encontrada") if s.find("time") else "Fecha no encontrada"

                articulo = s.find("article")
                if articulo:
                    parrafos = articulo.find_all("p")
                    contenido = "\n".join([p.get_text(strip=True) for p in parrafos])
                else:
                    contenido = "Contenido no encontrado"

                # Campos adicionales
                autor = s.find("span", {"class": "autor"}).get_text(strip=True) if s.find("span", {"class": "autor"}) else "Autor no encontrado"
                categoria = s.find("a", {"class": "categoria"}).get_text(strip=True) if s.find("a", {"class": "categoria"}) else "Categoría no encontrada"
                descripcion = s.find("meta", {"name": "description"}).get("content", "") if s.find("meta", {"name": "description"}) else "Descripción no encontrada"
                imagen_url = s.find("meta", {"property": "og:image"}).get("content", "") if s.find("meta", {"property": "og:image"}) else "Sin imagen"
                lugar = s.find("span", {"class": "ubicacion"}).get_text(strip=True) if s.find("span", {"class": "ubicacion"}) else "Lugar no encontrado"

                # Guardar en Supabase (tabla noticiasp)
                data = {
                    "diario": diario,
                    "titulo": titulo,
                    "fecha": fecha,
                    "enlace": link,
                    "contenido": contenido,
                    "autor": autor,
                    "categoria": categoria,
                    "imagen_url": imagen_url,
                    "descripcion": descripcion,
                    "lugar": lugar
                }
                supabase.table("noticiass").insert(data).execute()

                print(f"✅ Guardada en Supabase: {titulo[:70]}...")
            except Exception as e:
                print(f"⚠️ Error con noticia {link}: {e}")

    except Exception as e:
        print(f"❌ Error al extraer {diario}: {e}")

# ==============================
# Ejecutar scraping
# ==============================

guardar_noticias("RPP", "https://rpp.pe", "https://rpp.pe/lima", "h2 a")
guardar_noticias("El Comercio", "https://elcomercio.pe", "https://elcomercio.pe/ultimas-noticias", "h2 a")
guardar_noticias("La República", "https://larepublica.pe", "https://larepublica.pe/ultimas-noticias", "h2 a")
guardar_noticias("Perú21", "https://peru21.pe", "https://peru21.pe/ultimas-noticias", "h2 a")
guardar_noticias("Correo", "https://diariocorreo.pe", "https://diariocorreo.pe/ultimas-noticias", "h2 a")
guardar_noticias("Gestión", "https://gestion.pe", "https://gestion.pe/ultimas-noticias", "h2 a")
guardar_noticias("Expreso", "https://expreso.com.pe", "https://expreso.com.pe/politica", "h2 a")
guardar_noticias("Andina", "https://andina.pe", "https://andina.pe/agencia/seccion.aspx?id=7", "h2 a")
guardar_noticias("Ojo", "https://ojo.pe", "https://ojo.pe/ultimas-noticias", "h2 a")
guardar_noticias("Trome", "https://trome.pe", "https://trome.pe/ultimas-noticias", "h2 a")
guardar_noticias("Exitosa", "https://exitosanoticias.pe", "https://exitosanoticias.pe/actualidad", "h2 a")
guardar_noticias("BBC Mundo", "https://www.bbc.com", "https://www.bbc.com/mundo", "h2 a")
