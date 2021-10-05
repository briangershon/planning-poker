import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import AboutPage from './AboutPage';

afterEach(cleanup);

describe('This will test HomePage', () => {
  it('renders', () => {
    const { getByText } = render(<AboutPage />);
    expect(document.body.contains(getByText('About')));
  });
});
