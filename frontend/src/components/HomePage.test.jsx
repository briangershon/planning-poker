import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import HomePage from './HomePage';

afterEach(cleanup);

describe('This will test HomePage', () => {
  it('renders', () => {
    const { getByText } = render(<HomePage />);
    expect(document.body.contains(getByText('Home')));
  });
});
