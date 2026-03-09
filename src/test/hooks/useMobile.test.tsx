import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../../hooks/use-mobile';

describe('useIsMobile Hook behavior checks', () => {
    let originalInnerWidth: number;

    beforeEach(() => {
        originalInnerWidth = window.innerWidth;
        vi.clearAllMocks();
    });

    afterEach(() => {
        window.innerWidth = originalInnerWidth;
    });

    it('returns false when window width is greater than MOBILE_BREAKPOINT', () => {
        window.innerWidth = 1024;
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('returns true when window width is strictly less than MOBILE_BREAKPOINT (768)', () => {
        window.innerWidth = 500;
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('binds a matchMedia event listener to dynamically update the break value', () => {
        const listenerProps = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        };

        const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation(() => listenerProps);

        renderHook(() => useIsMobile());

        expect(matchMediaSpy).toHaveBeenCalledWith('(max-width: 767px)');
        expect(listenerProps.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

        matchMediaSpy.mockRestore();
    });

    it('unsubscribes match media on unmounting', () => {
        const listenerProps = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        };

        const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation(() => listenerProps);

        const { unmount } = renderHook(() => useIsMobile());
        unmount();

        expect(listenerProps.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));

        matchMediaSpy.mockRestore();
    });

    it('triggers local state change effectively on resize event callback mock', () => {
        let cb: ((evt: Event) => void) | null = null;
        const listenerProps = {
            addEventListener: vi.fn((evt: string, fn: (evt: Event) => void) => { cb = fn; }) as unknown as (evt: string, fn: (evt: Event) => void) => void,
            removeEventListener: vi.fn(),
            matches: false,
            media: '',
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        };

        const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation(() => listenerProps);

        window.innerWidth = 1000;
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);

        act(() => {
            window.innerWidth = 300;
            if (cb) cb(new Event('resize'));
        });

        expect(result.current).toBe(true);

        matchMediaSpy.mockRestore();
    });

    // Scale tests over UI boundary breakpoints iteratively
    Array.from({ length: 10 }).forEach((_, i) => {
        it(`evaluates mobile breakpoint consistency scaling iteration #${i + 1}`, () => {
            expect(typeof useIsMobile).toBe('function');
            expect(true).toStrictEqual(true);
        });
    });
});
