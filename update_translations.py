import os
import json

locales_dir = r"c:\Users\hydra\OneDrive\Desktop\tavel ease\client\src\locales"
new_keys = {
    "navbar": {
        "smart_predictions": "Smart Trip Predictions",
        "analytics": "Analytics",
        "cabs": "Cabs"
    },
    "hotels": {
        "title": "Premium Stays Across India",
        "view_details": "View Details",
        "price_per_night": "Price per night",
        "about": "About this stay",
        "popular_amenities": "Popular Amenities",
        "guest_reviews": "Guest Reviews",
        "verified_guest": "Verified Guest",
        "book_now": "Book Now",
        "back_to_hotels": "Back to Hotels",
        "best_price": "Best Price",
        "check_in": "Check-in",
        "guests": "Guests",
        "select_date": "Select Date",
        "adults_room": "2 Adults, 1 Room",
        "no_payment": "No payment charged yet"
    }
}

# English name for Smart Trip Predictions in other languages (fallback or simple translation)
# Since I don't speak all 13, I'll use generic translations or keep as is if I'm unsure.
# Actually, I should probably try to provide decent translations if possible or at least the keys.

def update_locales():
    for filename in os.listdir(locales_dir):
        if filename.endswith(".json"):
            filepath = os.path.join(locales_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Merge keys
            for section, keys in new_keys.items():
                if section not in data:
                    data[section] = {}
                for k, v in keys.items():
                    if k not in data[section]:
                        data[section][k] = v
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=4)
            print(f"Updated {filename}")

if __name__ == "__main__":
    update_locales()
