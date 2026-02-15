import requests

urls = [
    "http://localhost:5175/background_day.png",
    "http://localhost:5175/background_night.png"
]

for url in urls:
    try:
        response = requests.head(url)
        print(f"{url}: Status {response.status_code}, Type {response.headers.get('content-type')}, Size {response.headers.get('content-length')}")
    except Exception as e:
        print(f"{url}: Failed - {e}")
