import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../../components/ui/input';
import React from 'react';

describe('Input Component', () => {
    it('renders an input element', () => {
        render(<Input placeholder="Enter text" />);
        const input = screen.getByPlaceholderText('Enter text');
        expect(input).toBeInTheDocument();
        expect(input.tagName).toBe('INPUT');
    });

    it('applies default tailwind styling', () => {
        render(<Input placeholder="Default" />);
        const input = screen.getByPlaceholderText('Default');
        expect(input).toHaveClass('flex', 'h-10', 'w-full', 'rounded-md', 'border', 'border-input', 'bg-background', 'px-3', 'py-2', 'text-base', 'ring-offset-background', 'file:border-0', 'file:bg-transparent', 'file:text-sm', 'file:font-medium', 'file:text-foreground', 'placeholder:text-muted-foreground', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2', 'disabled:cursor-not-allowed', 'disabled:opacity-50', 'md:text-sm');
    });

    it('accepts custom class names', () => {
        render(<Input placeholder="Custom" className="custom-input-class bg-blue-500" />);
        const input = screen.getByPlaceholderText('Custom');
        expect(input).toHaveClass('custom-input-class bg-blue-500');
    });

    it('can be typed into', async () => {
        render(<Input placeholder="Type here" />);
        const input = screen.getByPlaceholderText('Type here');

        await userEvent.type(input, 'Hello World');
        expect(input).toHaveValue('Hello World');
    });

    it('can be disabled', async () => {
        render(<Input placeholder="Disabled" disabled />);
        const input = screen.getByPlaceholderText('Disabled');

        expect(input).toBeDisabled();

        await userEvent.type(input, 'Testing');
        expect(input).toHaveValue(''); // Should remain empty
    });

    it('supports different types like "password"', () => {
        render(<Input placeholder="Password" type="password" />);
        const input = screen.getByPlaceholderText('Password');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('supports different types like "email" or "number"', () => {
        render(
            <>
                <Input placeholder="Email" type="email" />
                <Input placeholder="Number" type="number" />
            </>
        );
        expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email');
        expect(screen.getByPlaceholderText('Number')).toHaveAttribute('type', 'number');
    });

    it('forwards ref correctly', () => {
        const ref = React.createRef<HTMLInputElement>();
        render(<Input ref={ref} placeholder="Ref Input" />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('is accessible (valid HTML5 attributes)', () => {
        render(<Input aria-label="accessible-input" required aria-invalid="true" />);
        const input = screen.getByRole('textbox', { name: "accessible-input" });
        expect(input).toBeRequired();
        expect(input).toBeInvalid();
    });

    it('handles default value correctly (uncontrolled)', () => {
        render(<Input defaultValue="Initial" />);
        expect(screen.getByDisplayValue('Initial')).toBeInTheDocument();
    });
});
