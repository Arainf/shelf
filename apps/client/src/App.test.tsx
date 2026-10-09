import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
    it('renders the Shelf system check header', () => {
        render(<App />);
        expect(screen.getByText(/Shelf System Check/i)).toBeDefined();
    });
});