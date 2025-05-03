###################################################
# Purpose: delete all firebase user using FB provider for authentication (as I'm removing it)
#
#
# gcloud auth print-access-token
# get the token that starts with 1//
#
#  export the users
#  firebase auth:export users.json --format=json --project PROJECT_ID --token "1//..."
#
#  python remove_fb_users.py --input users.json --token 1//xxxx --project PROJECT_ID --dry-run
#
#


import argparse
import json
import subprocess
import sys
from pathlib import Path

import requests

def delete_firebase_user(uid, token, project_id, dry_run=False):
    if dry_run:
        return {"status": "dry-run", "uid": uid, "email": None}

    url = f"https://identitytoolkit.googleapis.com/v1/projects/{project_id}/accounts:delete"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "x-goog-user-project": project_id  # <- ajoute ceci
    }
    data = {"localId": uid}
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            return {"status": "deleted", "uid": uid}
        else:
            return {
                "status": "error",
                "uid": uid,
                "error": response.text
            }
    except Exception as e:
        return {
            "status": "error",
            "uid": uid,
            "error": str(e)
        }




def load_users(input_file):
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, dict) or "users" not in data:
        raise ValueError("Expected top-level key 'users' with a list of users.")

    if not isinstance(data["users"], list):
        raise ValueError("Expected 'users' to be a list.")

    return data["users"]





def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to users.json")
    parser.add_argument("--token", required=True, help="Firebase CLI token")
    parser.add_argument("--project", required=True, help="Firebase project ID")
    parser.add_argument("--dry-run", action="store_true", help="Dry run (no deletion)")

    args = parser.parse_args()
    users = load_users(args.input)

    results = []

    for user in users:
        providers = user.get("providerUserInfo", [])
        if any(p.get("providerId") == "facebook.com" for p in providers):
            uid = user["localId"]
            email = user.get("email", "")
            result = delete_firebase_user(uid, args.token, args.project, args.dry_run)
            result.update({"uid": uid, "email": email})
            results.append(result)

    # Write output to file
    output_path = Path(args.input).with_suffix('.deleted.json')
    with open(output_path, "w") as out_file:
        json.dump(results, out_file, indent=2)

    print(f"✅ Results written to: {output_path}")

if __name__ == "__main__":
    main()
