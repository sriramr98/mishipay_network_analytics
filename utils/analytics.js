export const convertSecondsToReadableFormat = (network_usage = []) => {
    return network_usage.map((usage) => ({
        username: usage.username,
        lastDayUsage: convertSecondsToClosestHour(parseInt(usage.lastdayusage)),
        last7DayUsage: convertSecondsToClosestHour(
            parseInt(usage.last7dayusage),
        ),
        last30DayUsage: convertSecondsToClosestHour(
            parseInt(usage.last30dayusage),
        ),
    }));
};

const convertSecondsToClosestHour = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    if (hours < 1) {
        // If seconds < 3600, hour < 1, try representing in minutes
        const minutes = Math.floor(seconds / 60);
        if (minutes < 1) {
            // if seconds < 60, minutes < 1 then return in seconds
            return `${seconds}s`;
        }

        const remainingSeconds = seconds - minutes * 60;
        return `${minutes}m${remainingSeconds}s`;
    }

    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h${Math.round(remainingMinutes)}m${remainingSeconds}s`;
};
