from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import math
import json
import os

app = Flask(__name__)
CORS(app)

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dLat, dLon = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    lat1, lat2 = math.radians(lat1), math.radians(lat2)
    a = math.sin(dLat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dLon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@app.route('/calculateRisk', methods=['POST'])
def calculate_risk():
    data = request.json
    current_location = data.get('currentLocation')

    # Smartly handle data from either demo
    if 'username' in data:
        # This is from the "bank_demo"
        try:
            username = data.get('username')
            user_data_path = os.path.join(os.path.dirname(__file__), f"{username}.json")
            with open(user_data_path, 'r') as f:
                user_data = json.load(f)
            # --- FIX: Moved these lines inside the 'try' block ---
            sim_activation_date_str = user_data.get('simActivationDate')
            safe_zones = user_data.get('safe_zones', [])
        except FileNotFoundError:
            return jsonify({"error": "User not found"}), 404
    else:
        # This is from the original "interactive demo"
        sim_activation_date_str = data.get('simActivationDate')
        safe_zones = data.get('safeZones', [])
    
    # This check prevents the error if a date is missing
    if not sim_activation_date_str:
        return jsonify({"error": "SIM activation date not found for user."}), 400

    activation_date = datetime.strptime(sim_activation_date_str, '%Y-%m-%d')
    days_since_activation = (datetime.now() - activation_date).days

    sim_factor = 0
    if days_since_activation <= 3: sim_factor = 100
    elif days_since_activation <= 7: sim_factor = 80
    elif days_since_activation <= 30: sim_factor = 50
    elif days_since_activation <= 180: sim_factor = 20
    else: sim_factor = 5

    location_factor = 100 
    if safe_zones:
        min_distance = min(haversine(current_location['lat'], current_location['lon'], zone['lat'], zone['lon']) for zone in safe_zones)
        if min_distance <= 2: location_factor = 0
        else:
            L, k, x0 = 100, 0.2, 25
            location_factor = L / (1 + math.exp(-k * (min_distance - x0)))

    final_score = round((0.65 * sim_factor) + (0.35 * location_factor))

    decision = ""
    if final_score <= 20: decision = "ALLOW: Login Successful"
    elif 20 < final_score <= 50: decision = "MONITOR: Login Allowed, Flag Raised"
    elif 50 < final_score <= 85: decision = "VERIFY: Biometric Authentication Required"
    else: decision = "BLOCK: Access Denied. Suspicious Activity Detected."

    return jsonify({ "riskScore": final_score, "decision": decision })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

