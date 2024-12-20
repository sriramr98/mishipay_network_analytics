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

export const convertSecondsToClosestHour = (seconds) => {
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

export const formatNetworkUsage = (kilobits) => {
    const units = ['KB', 'MB', 'GB', 'TB'];
    let value = kilobits / 1024; // Convert kilobits to kilobytes
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex++;
    }
    const formattedValue = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
    return `${formattedValue}${units[unitIndex]}`;
};
