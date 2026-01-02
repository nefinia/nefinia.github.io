#!/usr/bin/env python3
"""
Build a geo-quote spreadsheet for Paris from official open-data.

Why plaques?
- They are text (inscriptions) physically installed at a location.
- The Ville de Paris publishes commemorative plaques datasets under ODbL.
- This avoids the licensing mess of film/book quotes for a first monetizable PoC.

Data source
- Paris Data (opendata.paris.fr) using the Opendatasoft Explore API v2.1 records endpoint:
  /api/explore/v2.1/catalog/datasets/<dataset_id>/records?limit=...&offset=...

Output columns (normalized)
- place_name
- address
- arrondissement
- latitude
- longitude
- inscription_original
- inscription_language (best-effort; often 'fr')
- people_or_event (if present)
- date_or_period (if present)
- category (if present)
- dataset_id
- record_identifier
- source_dataset_url
- source_api_url
- license

Run
  python build_paris_plaques_sheet.py --out paris_plaques_quotes.xlsx --n 1000

Notes
- Field names can change across datasets. This script uses heuristics to locate the right fields.
- If you want English text, keep inscription_original and add a translated column later
  (do NOT auto-translate without checking license/attribution requirements).
"""

from __future__ import annotations

import argparse
import re
from typing import Any, Dict, Iterable, List, Optional, Tuple

import pandas as pd
import requests


PARIS_DATA_DOMAIN = "https://opendata.paris.fr"
DATASETS_DEFAULT = [
    "plaques_commemoratives",          # general plaques
    "plaques_commemoratives_1939-1945" # WWII-focused plaques
]


def _looks_like_latlon(v: Any) -> Optional[Tuple[float, float]]:
    # common shapes: [lat, lon] or {"lat":..,"lon":..} or {"coordinates":[lon,lat]}
    try:
        if isinstance(v, (list, tuple)) and len(v) == 2:
            lat, lon = float(v[0]), float(v[1])
            if -90 <= lat <= 90 and -180 <= lon <= 180:
                return lat, lon
        if isinstance(v, dict):
            if "lat" in v and ("lon" in v or "lng" in v):
                lat = float(v["lat"])
                lon = float(v.get("lon", v.get("lng")))
                if -90 <= lat <= 90 and -180 <= lon <= 180:
                    return lat, lon
            if v.get("type") and "coordinates" in v:
                coords = v["coordinates"]
                if isinstance(coords, (list, tuple)) and len(coords) >= 2:
                    lon, lat = float(coords[0]), float(coords[1])
                    if -90 <= lat <= 90 and -180 <= lon <= 180:
                        return lat, lon
    except Exception:
        return None
    return None


def extract_latlon(record: Dict[str, Any]) -> Tuple[Optional[float], Optional[float]]:
    # Check obvious keys first
    for k in [
        "geo_point_2d",
        "geopoint",
        "coordonnees_geographiques",
        "coordinates",
        "coordonnees",
        "location",
        "localisation",
    ]:
        if k in record:
            ll = _looks_like_latlon(record[k])
            if ll:
                return ll[0], ll[1]

    # Sometimes geometry is nested
    for k in ["geometry", "geo_shape", "geom"]:
        if k in record and isinstance(record[k], dict):
            ll = _looks_like_latlon(record[k])
            if ll:
                return ll[0], ll[1]
            # try record[k]["coordinates"]
            ll = _looks_like_latlon(record[k].get("coordinates"))
            if ll:
                return ll[0], ll[1]

    # Last resort: scan values
    for v in record.values():
        ll = _looks_like_latlon(v)
        if ll:
            return ll[0], ll[1]

    return None, None


def pick_first(record: Dict[str, Any], keys: Iterable[str]) -> Optional[str]:
    for k in keys:
        if k in record and record[k] not in (None, "", []):
            v = record[k]
            if isinstance(v, (list, tuple)):
                # join short lists
                return ", ".join(str(x) for x in v if x not in (None, ""))
            return str(v)
    return None


def guess_inscription_key(record: Dict[str, Any]) -> Optional[str]:
    # Prefer explicit text keys
    candidates = [k for k in record.keys() if re.search(r"(texte|inscription|contenu|text)", k, re.I)]
    # Avoid non-inscription text fields
    bad = {"adresse", "address", "url", "source", "notes", "commentaire", "description"}
    candidates = [k for k in candidates if not any(b in k.lower() for b in bad)]
    return candidates[0] if candidates else None


def normalize_record(dataset_id: str, raw: Dict[str, Any], source_api_url: str) -> Dict[str, Any]:
    # Handle both API shapes:
    # v2.1: {"results":[{...}]}   vs v1: {"records":[{"recordid":..., "fields":{...}, "geometry":...}]}
    record_id = raw.get("record_id") or raw.get("recordid") or raw.get("id") or raw.get("_id")
    fields = raw.get("fields") if isinstance(raw.get("fields"), dict) else raw
    if not isinstance(fields, dict):
        fields = {}

    lat, lon = extract_latlon({**fields, **{k: raw.get(k) for k in ("geometry", "geo_shape", "geo_point_2d")}})

    inscription_key = guess_inscription_key(fields)
    inscription = fields.get(inscription_key) if inscription_key else None
    if isinstance(inscription, (list, tuple)):
        inscription = " ".join(str(x) for x in inscription)

    place_name = pick_first(fields, [
        "titre", "title", "nom", "name",
        "titre_plaque", "intitule", "intitulé",
        "designation", "désignation",
    ])

    address = pick_first(fields, ["adresse", "address", "adresse_complete", "adresse complète", "localisation", "lieu"])
    arrondissement = pick_first(fields, ["arrondissement", "ardt", "arrdt", "c_ar", "c_arcode"])
    people_or_event = pick_first(fields, ["personne", "personnes", "nom_personne", "evenement", "événement", "objet"])
    date_or_period = pick_first(fields, ["date", "annee", "année", "periode", "période"])
    category = pick_first(fields, ["categorie", "catégorie", "type", "thematique", "thématique", "theme", "thème"])

    # Best-effort language guess
    lang = pick_first(fields, ["langue", "language"]) or "fr"

    return {
        "place_name": place_name,
        "address": address,
        "arrondissement": arrondissement,
        "latitude": lat,
        "longitude": lon,
        "inscription_original": inscription,
        "inscription_language": lang,
        "people_or_event": people_or_event,
        "date_or_period": date_or_period,
        "category": category,
        "dataset_id": dataset_id,
        "record_identifier": record_id,
        "source_dataset_url": f"{PARIS_DATA_DOMAIN}/explore/dataset/{dataset_id}/",
        "source_api_url": source_api_url,
        "license": "ODbL (see source_dataset_url)",
    }


def fetch_records(dataset_id: str, limit: int, offset: int) -> Dict[str, Any]:
    url = f"{PARIS_DATA_DOMAIN}/api/explore/v2.1/catalog/datasets/{dataset_id}/records"
    params = {"limit": limit, "offset": offset}
    r = requests.get(url, params=params, timeout=60)
    r.raise_for_status()
    data = r.json()
    data["_source_api_url"] = r.url
    return data


def iter_all(dataset_id: str, page_size: int = 1000) -> Iterable[Dict[str, Any]]:
    offset = 0
    while True:
        data = fetch_records(dataset_id, limit=page_size, offset=offset)
        api_url = data.get("_source_api_url", "")
        # v2.1 shape
        if "results" in data and isinstance(data["results"], list):
            results = data["results"]
            if not results:
                break
            for item in results:
                yield {"_api_url": api_url, "_raw": item}
            offset += len(results)
            total = data.get("total_count") or data.get("total") or None
            if total is not None and offset >= int(total):
                break
            continue

        # fallback: v1 shape
        if "records" in data and isinstance(data["records"], list):
            records = data["records"]
            if not records:
                break
            for item in records:
                yield {"_api_url": api_url, "_raw": item}
            offset += len(records)
            total = data.get("nhits") or None
            if total is not None and offset >= int(total):
                break
            continue

        # unknown shape
        break


def build_sheet(datasets: List[str], n: int, page_size: int) -> pd.DataFrame:
    rows: List[Dict[str, Any]] = []
    for ds in datasets:
        for wrapped in iter_all(ds, page_size=page_size):
            row = normalize_record(ds, wrapped["_raw"], wrapped["_api_url"])
            # Filter: require inscription and coordinates (for map pins that make sense)
            if not row["inscription_original"]:
                continue
            if row["latitude"] is None or row["longitude"] is None:
                continue
            rows.append(row)
            if len(rows) >= n:
                return pd.DataFrame(rows)
    return pd.DataFrame(rows)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="paris_plaques_quotes.xlsx", help="Output .xlsx path")
    ap.add_argument("--n", type=int, default=1000, help="Number of rows to collect")
    ap.add_argument("--page-size", type=int, default=500, help="API page size (limit param)")
    ap.add_argument("--datasets", nargs="*", default=DATASETS_DEFAULT, help="Dataset ids to pull from")
    args = ap.parse_args()

    df = build_sheet(args.datasets, n=args.n, page_size=args.page_size)

    # A small quality-of-life sort: longer inscriptions first
    df["inscription_len"] = df["inscription_original"].astype(str).str.len()
    df = df.sort_values(["inscription_len"], ascending=False).drop(columns=["inscription_len"])

    # Write
    with pd.ExcelWriter(args.out, engine="openpyxl") as xw:
        df.to_excel(xw, index=False, sheet_name="paris_plaques_quotes")

    print(f"Wrote {len(df)} rows to {args.out}")


if __name__ == "__main__":
    main()
