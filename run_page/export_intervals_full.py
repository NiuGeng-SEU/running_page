import os
import sys
import json
from datetime import datetime, timedelta
import requests
from requests.auth import HTTPBasicAuth

def main():
    if len(sys.argv) < 3:
        print("Usage: python export_intervals_full.py <athlete_id> <api_key>")
        sys.exit(1)

    athlete_id = sys.argv[1]
    api_key = sys.argv[2]

    session = requests.Session()
    session.auth = HTTPBasicAuth("API_KEY", api_key)
    session.headers["Accept"] = "application/json"

    base_url = "https://intervals.icu/api/v1"
    today = datetime.now().strftime("%Y-%m-%d")
    # Fetch past 14 days
    start_date = (datetime.now() - timedelta(days=14)).strftime("%Y-%m-%d")

    print(f"Fetching Intervals.icu data for athlete {athlete_id} from {start_date} to {today}...")

    # 1. Activities list
    act_url = f"{base_url}/athlete/{athlete_id}/activities?oldest={start_date}&newest={today}"
    r_act = session.get(act_url, timeout=30)
    if not r_act.ok:
        print(f"Failed to fetch activities: {r_act.status_code} {r_act.text}")
        sys.exit(1)
    activities = r_act.json()
    print(f"Fetched {len(activities)} activities.")

    # 2. Detailed view for recent activities (e.g. today & yesterday)
    detailed_activities = []
    for act in activities[-10:]:
        act_id = act.get("id")
        try:
            d_res = session.get(f"{base_url}/activity/{act_id}", timeout=30)
            if d_res.ok:
                detailed_activities.append(d_res.json())
            else:
                detailed_activities.append(act)
        except Exception as e:
            print(f"Error fetching detail for {act_id}: {e}")
            detailed_activities.append(act)

    # 3. Wellness (Fitness CTL, Fatigue ATL, Form TSB, HRV, resting HR, etc.)
    well_url = f"{base_url}/athlete/{athlete_id}/wellness?oldest={start_date}&newest={today}"
    r_well = session.get(well_url, timeout=30)
    wellness = r_well.json() if r_well.ok else []
    print(f"Fetched {len(wellness)} wellness records.")

    result = {
        "generated_at": datetime.now().isoformat(),
        "athlete_id": athlete_id,
        "activities": activities,
        "detailed_recent": detailed_activities,
        "wellness": wellness
    }

    out_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "static", "intervals_detail.json")
    os.makedirs(os.path.dirname(out_file), exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Saved complete Intervals.icu dataset to {out_file} (size: {os.path.getsize(out_file)} bytes)")

if __name__ == "__main__":
    main()
