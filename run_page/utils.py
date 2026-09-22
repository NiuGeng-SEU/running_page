import json
import os
from datetime import datetime

import pytz
from generator import Generator


def adjust_time(time, tz_name):
    tc_offset = datetime.now(pytz.timezone(tz_name)).utcoffset()
    return time + tc_offset


def adjust_time_to_utc(time, tz_name):
    tc_offset = datetime.now(pytz.timezone(tz_name)).utcoffset()
    return time - tc_offset


def adjust_timestamp_to_utc(timestamp, tz_name):
    tc_offset = datetime.now(pytz.timezone(tz_name)).utcoffset()
    delta = int(tc_offset.total_seconds())
    return int(timestamp) - delta


def to_date(ts):
    """
    Parse ISO format timestamp string to datetime object.
    Uses datetime.fromisoformat() for standard ISO format strings.
    Falls back to strptime for non-standard formats.
    """
    try:
        return datetime.fromisoformat(ts)
    except ValueError:
        ts_fmts = ["%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M:%S.%f"]
        for ts_fmt in ts_fmts:
            try:
                return datetime.strptime(ts, ts_fmt)
            except ValueError:
                pass
        raise ValueError(f"cannot parse timestamp {ts} into date")


def make_activities_file(
    sql_file,
    data_dir,
    json_file,
    file_suffix="gpx",
    activity_title_dict={},
    activity_start_date_local_dict={},
):
    os.makedirs(data_dir, exist_ok=True)
    generator = Generator(sql_file)
    generator.sync_from_data_dir(
        data_dir,
        file_suffix=file_suffix,
        activity_title_dict=activity_title_dict,
        activity_start_date_local_dict=activity_start_date_local_dict,
    )
    activities_list = generator.load()
    if activities_list or not os.path.exists(json_file):
        with open(json_file, "w") as f:
            json.dump(activities_list, f)
