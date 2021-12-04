import React from 'react';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { GameStory } from './GameStory';

afterEach(cleanup);

describe('GameStory', () => {
  it('renders the story text', () => {
    render(<GameStory story={'cool tech'} />);
    const input = screen.getByPlaceholderText('Please add a story');
    expect(input.textContent).to.equal('cool tech');
  });

  it('does not explode if callback not provided when onBlur', () => {
    render(<GameStory />);
    const input = screen.getByPlaceholderText('Please add a story');
    fireEvent.blur(input, {
      target: { value: 'Hello' },
    });
  });

  it('sanitizes and removes tags from content passed in via story property', () => {
    render(<GameStory story={'<div>Hello</div>'} />);
    const input = screen.getByPlaceholderText('Please add a story');
    expect(input.textContent).to.equal('Hello');
  });

  it('sanitizes content when calling sendStoryUpdate() callback', () => {
    const sendStoryUpdate = spy();
    render(<GameStory sendStoryUpdate={sendStoryUpdate} />);
    const input = screen.getByPlaceholderText('Please add a story');
    fireEvent.blur(input, {
      target: { value: '<div>Hello</div>' },
    });
    expect(sendStoryUpdate.args[0][0]).to.equal('Hello');
  });

  it('shows message when user changes input', () => {
    render(<GameStory />);
    const input = screen.getByPlaceholderText('Please add a story');
    fireEvent.input(input, {
      target: { value: 'new text' },
    });
    const saveMessage = screen.getByText('Unsaved changes!');
  });

  it('disable does not show "click to edit" message', () => {
    render(<GameStory story={'my story'} />);
    const input = screen.getByPlaceholderText('Please add a story');
    const saveMessage = screen.queryByText('Click to edit.');
    expect(saveMessage).to.be.null;
  });
});
