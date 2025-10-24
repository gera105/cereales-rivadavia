import { useEffect } from 'react';
import type { View } from '../types';

// Heights in rem for fixed bottom navigation elements
const BOTTOM_NAV_HEIGHT_REM = 4.5;
const FORM_STEPPER_NAV_HEIGHT_REM = 5.0; 

/**
 * A hook to dynamically adjust the scroll padding at the bottom of the page.
 * This is crucial for mobile devices to prevent the on-screen keyboard from
 * obscuring input fields that are focused. It listens to the visual viewport's
 * resize event, which fires when the keyboard appears or disappears.
 * @param view The current view of the application, used to determine which
 * fixed navigation bar is present and thus how much base padding is needed.
 */
export const useDynamicScrollPadding = (view: View) => {
    useEffect(() => {
        // This feature only works in browsers that support the Visual Viewport API.
        if (typeof window === 'undefined' || !window.visualViewport) {
            return;
        }

        const root = document.documentElement;
        
        const handleResize = () => {
            const vp = window.visualViewport;
            if (!vp) return;

            // 1. Determine base padding for any visible fixed bottom UI (e.g., nav bars).
            const basePaddingRem = view === 'form' 
                ? FORM_STEPPER_NAV_HEIGHT_REM 
                : BOTTOM_NAV_HEIGHT_REM;
            
            const remInPx = parseFloat(getComputedStyle(root).fontSize);
            const basePaddingPx = basePaddingRem * remInPx;

            // 2. Calculate the height of the virtual keyboard.
            // This is the difference between the window's total inner height and the
            // visual viewport's height. This is a robust way to measure the space
            // taken by the on-screen keyboard.
            const keyboardHeight = window.innerHeight - vp.height;
            
            // Ensure keyboard height is not negative due to browser quirks or zoom behavior.
            const finalKeyboardHeight = Math.max(0, keyboardHeight);

            // 3. The total scroll padding should be the height of the keyboard,
            // plus the height of any fixed navigation bar that sits on top of the keyboard area.
            // This ensures that when an input is scrolled into view, it appears *above*
            // the fixed nav, which is itself above the keyboard.
            const totalPadding = basePaddingPx + finalKeyboardHeight;
            
            root.style.setProperty('scroll-padding-bottom', `${totalPadding}px`);
        };
        
        // Run once on mount and then on every resize of the visual viewport.
        handleResize();
        window.visualViewport.addEventListener('resize', handleResize);

        // Cleanup on unmount or when the view changes.
        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            root.style.removeProperty('scroll-padding-bottom');
        };
    }, [view]); // Rerun the effect if the view changes to adjust base padding.
};
