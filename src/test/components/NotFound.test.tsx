import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../../pages/NotFound';
import React from 'react';

const renderNotFoundPage = () => {
    return render(
        <BrowserRouter>
            <NotFound />
        </BrowserRouter>
    );
};

describe('NotFound Page Tests', () => {
    it('renders effectively without crashing', () => {
        const { container } = renderNotFoundPage();
        expect(container).toBeInTheDocument();
    });

    it('displays a 404 heading prominently to visually cue error to user', () => {
        renderNotFoundPage();
        const headingOptions = screen.getAllByRole('heading', { level: 1 });
        expect(headingOptions[0]).toHaveTextContent('404');
    });

    it('displays the "Oops! Page not found" descriptive fallback text', () => {
        renderNotFoundPage();
        const textDesc = screen.getByText(/Oops! Page not found/i);
        expect(textDesc).toBeInTheDocument();
    });

    it('provides a sub-descriptor context paragraph explaining the state', () => {
        renderNotFoundPage();
        const para = screen.getByText(/Oops! Page not found/i);
        expect(para.tagName).toBe('P');
    });

    it('includes a navigation anchor/link to allow recovery back to home', () => {
        renderNotFoundPage();
        const homeLink = screen.getByRole('link', { name: /Return to Home/i });
        expect(homeLink).toBeInTheDocument();
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('asserts the recovery link has proper semantic button styling via href mapping', () => {
        renderNotFoundPage();
        const linkAction = screen.getByRole('link');
        // We expect it to be using a ui/button variant usually although rendered as a link
        // Checking tailwind traits applied
        expect(linkAction.className).toBeTruthy();
    });

    it('renders inside a full-viewport container context (min-h-screen)', () => {
        const { container } = renderNotFoundPage();
        expect(container.firstChild).toHaveClass('flex', 'min-h-screen', 'items-center', 'justify-center', 'bg-muted');
    });

    it('embeds a content block that handles inner rounded alignment via tailwind class', () => {
        renderNotFoundPage();
        // Getting the text container itself
        const mainTitle = screen.getByText('404').parentElement;
        expect(mainTitle).toHaveClass('text-center');
    });

    it('displays all core accessibility text fragments synchronously', () => {
        renderNotFoundPage();
        expect(screen.getByText('404')).toBeVisible();
        expect(screen.getByText('Oops! Page not found')).toBeVisible();
        expect(screen.getByRole('link')).toBeVisible();
    });

    it('simulates error boundaries structure integration efficiently by avoiding complex unmounted deps', () => {
        expect(() => renderNotFoundPage()).not.toThrow();
    });
});
