import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../components/ui/badge';

describe('Badge Component', () => {
    it('renders correctly with default (implicit) variant', () => {
        render(<Badge>Default Badge</Badge>);
        const badge = screen.getByText('Default Badge');
        expect(badge).toBeInTheDocument();
        expect(badge.tagName).toBe('DIV');
        expect(badge).toHaveClass('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80');
    });

    it('renders default variant explicitly', () => {
        render(<Badge variant="default">Default Enum Badge</Badge>);
        const badge = screen.getByText('Default Enum Badge');
        expect(badge).toHaveClass('border-transparent bg-primary text-primary-foreground hover:bg-primary/80');
    });

    it('renders secondary variant explicit classes', () => {
        render(<Badge variant="secondary">Secondary Badge</Badge>);
        const badge = screen.getByText('Secondary Badge');
        expect(badge).toHaveClass('border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80');
    });

    it('renders destructive variant cleanly for alert interactions', () => {
        render(<Badge variant="destructive">Error Badge</Badge>);
        const badge = screen.getByText('Error Badge');
        expect(badge).toHaveClass('border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80');
    });

    it('renders outline variant preserving semantic border traits', () => {
        render(<Badge variant="outline">Outline Badge</Badge>);
        const badge = screen.getByText('Outline Badge');
        expect(badge).toHaveClass('text-foreground');
    });

    it('allows extensive classname overriding via tailwind merge logic', () => {
        render(<Badge className="text-xl bg-orange-400">Custom Badge</Badge>);
        const badge = screen.getByText('Custom Badge');
        expect(badge).toHaveClass('text-xl bg-orange-400');
        // Ensure primary default still got merged or replaced
        expect(badge).toHaveClass('border-transparent');
    });

    it('functions well wrapping empty content or nullish content without collapsing', () => {
        const { container } = render(<Badge>{null}</Badge>);
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild).toHaveClass('inline-flex items-center rounded-full');
    });

    it('accepts generic HTMLDivElement properties', () => {
        render(<Badge id="badge-id" aria-hidden="true" title="badge-tooltip" tabIndex={0}>Prop Badge</Badge>);
        const badge = screen.getByText('Prop Badge');
        expect(badge).toHaveAttribute('id', 'badge-id');
        expect(badge).toHaveAttribute('aria-hidden', 'true');
        expect(badge).toHaveAttribute('title', 'badge-tooltip');
        expect(badge).toHaveAttribute('tabindex', '0');
    });

    it('can encompass complex nested structures such as icons', () => {
        render(
            <Badge>
                <span data-testid="icon-mock">ICON</span>
                Text
            </Badge>
        );
        expect(screen.getByTestId('icon-mock')).toBeInTheDocument();
        expect(screen.getByText('ICON')).toBeInTheDocument();
    });

    it('remains focusable according to ring parameters set in base style', () => {
        render(<Badge aria-label="interactive">Focusable</Badge>);
        const badge = screen.getByText('Focusable');
        expect(badge).toHaveClass('focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2');
    });
});
