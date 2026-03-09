import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../components/ui/button';
import React from 'react';

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center', 'whitespace-nowrap', 'rounded-md', 'text-sm', 'font-medium', 'ring-offset-background', 'transition-colors', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:pointer-events-none', 'disabled:opacity-50', 'bg-primary', 'text-primary-foreground', 'hover:bg-primary/90', 'h-10', 'px-4', 'py-2');
    });

    it('renders with different variants', () => {
        const { rerender } = render(<Button variant="destructive">Destructive</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-destructive text-destructive-foreground hover:bg-destructive/90');

        rerender(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole('button')).toHaveClass('border border-input bg-background hover:bg-accent hover:text-accent-foreground');

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-secondary text-secondary-foreground hover:bg-secondary/80');

        rerender(<Button variant="ghost">Ghost</Button>);
        expect(screen.getByRole('button')).toHaveClass('hover:bg-accent hover:text-accent-foreground');

        rerender(<Button variant="link">Link</Button>);
        expect(screen.getByRole('button')).toHaveClass('text-primary underline-offset-4 hover:underline');
    });

    it('renders with different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-9 rounded-md px-3');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-11 rounded-md px-8');

        rerender(<Button size="icon">Icon</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-10 w-10');
    });

    it('applies custom className over default variants', () => {
        render(<Button className="bg-red-500 custom-class">Custom</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
        expect(button).toHaveClass('bg-red-500');
    });

    it('is clickable and triggers onClick', async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Clickable</Button>);

        await userEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', async () => {
        const handleClick = vi.fn();
        render(<Button disabled onClick={handleClick}>Disabled</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();

        await userEvent.click(button);
        expect(handleClick).not.toHaveBeenCalled();
    });

    it('renders generic children components properly', () => {
        render(
            <Button>
                <span data-testid="child-span">Child Text</span>
            </Button>
        );
        expect(screen.getByTestId('child-span')).toBeInTheDocument();
    });

    it('renders as a different child component conditionally (asChild slot pattern)', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        const link = screen.getByRole('link', { name: /link button/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/test');
    });

    it('forwards refs properly', () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Button ref={ref}>Ref Check</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('can be assigned any valid button HTML attribute correctly', () => {
        render(<Button aria-label="custom-label" data-custom="value" type="submit">Attr Test</Button>);
        const btn = screen.getByRole('button');
        expect(btn).toHaveAttribute('aria-label', 'custom-label');
        expect(btn).toHaveAttribute('data-custom', 'value');
        expect(btn).toHaveAttribute('type', 'submit');
    });
});
