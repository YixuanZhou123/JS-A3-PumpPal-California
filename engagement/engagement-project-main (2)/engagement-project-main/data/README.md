# Data sources

All data comes from https://www.rideindego.com/about/data/. For station locations, use the [GBFS station information](https://gbfs.bcycle.com/bcycle_indego/station_information.json). For real time information, use the [statis status](https://gbfs.bcycle.com/bcycle_indego/station_status.json).

## Preprocessing historical data

1.  Create a virtual environment with `python3 -m venv env`
2.  Install dependencies with `pip install -r requirements.txt`
3.  Download and unzip desired historical Indego trip data from https://www.rideindego.com/about/data/
4.  Run `python aggregate_station_stats.py > station_stats.json`
