import csv
import datetime as dt
import json
import pathlib as pl
import sys

DATA_DIR = pl.Path(__file__).parent

stations_info: dict[str, dict] = {}


def ensure_station(id: str):
    if id not in stations_info:
        stations_info[id] = {
            hour: {'pickups': 0, 'dropoffs': 0} for hour in range(24)
        }


min_date: dt.date = None
max_date: dt.date = None

for csvpath in DATA_DIR.glob('*.csv'):
    print(f'Processing {csvpath}...', file=sys.stderr)
    with csvpath.open() as csvfile:
        reader = csv.DictReader(csvfile)
        for i, row in enumerate(reader):
            pickup_station = row['start_station']
            dropoff_station = row['end_station']

            try:
                pickup_time = dt.datetime.fromisoformat(row['start_time'])
                dropoff_time = dt.datetime.fromisoformat(row['end_time'])
            except ValueError:
                try:
                    pickup_time = dt.datetime.strptime(
                        row['start_time'], '%m/%d/%Y %H:%M')
                    dropoff_time = dt.datetime.strptime(
                        row['end_time'], '%m/%d/%Y %H:%M')
                except ValueError:
                    print(
                        f'Failed parsing datetime while reading row {i}',
                        file=sys.stderr)
                    raise

            if min_date is None or pickup_time < min_date:
                min_date = pickup_time

            if max_date is None or dropoff_time > max_date:
                max_date = dropoff_time

            ensure_station(pickup_station)
            ensure_station(dropoff_station)

            stations_info[pickup_station][pickup_time.hour]['pickups'] += 1
            stations_info[dropoff_station][dropoff_time.hour]['dropoffs'] += 1

num_days = (max_date.date() - min_date.date()).days
for station in stations_info:
    for hour in range(24):
        stations_info[station][hour]['pickups'] /= num_days
        stations_info[station][hour]['pickups'] = round(
            stations_info[station][hour]['pickups'], 2)

        stations_info[station][hour]['dropoffs'] /= num_days
        stations_info[station][hour]['dropoffs'] = round(
            stations_info[station][hour]['dropoffs'], 2)

print(json.dumps(stations_info, indent=0))
