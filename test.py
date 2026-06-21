import urllib.request
import json
from datetime import datetime, timedelta

def test_api():
    base_url = "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24"
    api_key = "579b464db66ec23bdd0000016958416b1f65421560b659f8970b0192"
    
    # test without sort
    url = f"{base_url}?api-key={api_key}&format=json&limit=5&filters[Commodity]=Wheat"
    req = urllib.request.urlopen(url)
    data = json.loads(req.read())
    print("Without sort:", [r.get('Arrival_Date') for r in data.get('records', [])])

    # test sort by arrival date desc
    url_sort = f"{base_url}?api-key={api_key}&format=json&limit=5&sort[Arrival_Date]=desc&filters[Commodity]=Wheat"
    try:
        req = urllib.request.urlopen(url_sort)
        data = json.loads(req.read())
        print("With sort desc:", [r.get('Arrival_Date') for r in data.get('records', [])])
    except Exception as e:
        print("Sort failed:", e)

if __name__ == '__main__':
    test_api()
