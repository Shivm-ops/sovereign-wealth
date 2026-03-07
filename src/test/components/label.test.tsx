import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '../../components/ui/label';
import React from 'react';

describe('Label Component', () => {
    it('renders a label element', () => {
        render(<Label htmlFor="test">Test Label</Label>);
        const label = screen.getByText('Test Label');
        expect(label.tagName).toBe('LABEL');
    });

    it('associates with an input id', () => {
        render(
            <>
                <Label htmlFor="some-id">Accessible Label</Label>
                <input id="some-id" />
            </>
        );
        const input = screen.getByLabelText('Accessible Label');
        expect(input.id).toBe('some-id');
    });

    it('applies Radix UI Primitive root classes and peer disabled styles', () => {
        render(<Label>Stylish Label</Label>);
        const label = screen.getByText('Stylish Label');
        expect(label).toHaveClass('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');
    });

    it('merges custom tailwind classes successfully', () => {
        render(<Label className="bg-red-500 font-bold p-2">Custom Label</Label>);
        const label = screen.getByText('Custom Label');
        expect(label).toHaveClass('text-sm', 'leading-none', 'peer-disabled:cursor-not-allowed', 'peer-disabled:opacity-70', 'bg-red-500', 'font-bold', 'p-2');
    });

    it('forwards React ref appropriately', () => {
        const ref = React.createRef<HTMLLabelElement>();
        render(<Label ref={ref}>Ref Check</Label>);
        expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });
});
