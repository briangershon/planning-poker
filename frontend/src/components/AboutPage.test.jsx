import React from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import AboutPage from './AboutPage';

afterEach(cleanup);

describe('This will test HomePage', () => {
  it('renders', () => {
    render(<AboutPage />);
    screen.getByText('About Planning Poker');
  });
});
