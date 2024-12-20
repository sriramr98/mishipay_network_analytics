import {describe, expect} from '@jest/globals';
import { convertSecondsToClosestHour, formatNetworkUsage, convertSecondsToReadableFormat } from '../../src/utils/analytics'

describe('convertSecondsToClosestHour', () => {
    test('should accurately convert seconds less than an hour to minutes and seconds', () => {
        expect(convertSecondsToClosestHour(59)).toBe('59s');
        expect(convertSecondsToClosestHour(60)).toBe('1m0s');
        expect(convertSecondsToClosestHour(61)).toBe('1m1s');
        expect(convertSecondsToClosestHour(119)).toBe('1m59s');
        expect(convertSecondsToClosestHour(120)).toBe('2m0s');
        expect(convertSecondsToClosestHour(121)).toBe('2m1s');
    })

    test('should accurately convert seconds to hours, minutes and seconds', () => {
        expect(convertSecondsToClosestHour(3599)).toBe('59m59s');
        expect(convertSecondsToClosestHour(3600)).toBe('1h0m0s');
        expect(convertSecondsToClosestHour(3601)).toBe('1h0m1s');
        expect(convertSecondsToClosestHour(3660)).toBe('1h1m0s');
        expect(convertSecondsToClosestHour(3661)).toBe('1h1m1s');
        expect(convertSecondsToClosestHour(7199)).toBe('1h59m59s');
        expect(convertSecondsToClosestHour(7200)).toBe('2h0m0s');
        expect(convertSecondsToClosestHour(7201)).toBe('2h0m1s');
    })
})

describe('formatNetworkUsage', () => {
    test('should accurately convert kilobits to readable format', () => {
        expect(formatNetworkUsage(1024)).toBe('1KB');
        expect(formatNetworkUsage(1024 * 1024)).toBe('1MB');
        expect(formatNetworkUsage(1024 * 1024 * 1024)).toBe('1GB');
        expect(formatNetworkUsage(1024 * 1024 * 1024 * 1024)).toBe('1TB');
    })

    test('should accurately convert kilobits to readable format with decimal points', () => {
        expect(formatNetworkUsage(1024 + 512)).toBe('1.5KB');
        expect(formatNetworkUsage(1024 * 1024 + 512 * 1024)).toBe('1.5MB');
        expect(formatNetworkUsage(1024 * 1024 * 1024 + 512 * 1024 * 1024)).toBe('1.5GB');
        expect(formatNetworkUsage(1024 * 1024 * 1024 * 1024 + 512 * 1024 * 1024 * 1024)).toBe('1.5TB');
    })
})

describe('convertSecondsToReadableFormat', () => {
    test('should accurately convert network usage to readable format', () => {
        const network_usage = [
            {
                username: 'user1',
                lastdayusage: 59,
                last7dayusage: 3600,
                last30dayusage: 3600 * 24,
            },
            {
                username: 'user2',
                lastdayusage: 61,
                last7dayusage: 3600 * 2,
                last30dayusage: 3600 * 24 * 2,
            },
        ];
        const expected = [
            {
                username: 'user1',
                lastDayUsage: '59s',
                last7DayUsage: '1h0m0s',
                last30DayUsage: '24h0m0s',
            },
            {
                username: 'user2',
                lastDayUsage: '1m1s',
                last7DayUsage: '2h0m0s',
                last30DayUsage: '48h0m0s',
            },
        ];
        expect(convertSecondsToReadableFormat(network_usage)).toEqual(expected);
    })

    test('should return empty array if network usage is empty', () => {
        expect(convertSecondsToReadableFormat()).toEqual([]);
    })
})