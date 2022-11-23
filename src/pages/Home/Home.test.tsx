import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Button from '../../components/Button/Button';

test('renders 開始使用 Button', () => {
  render(
    <BrowserRouter>
      <Button toggle />
    </BrowserRouter>,
  );
  const ButtonElement = screen.getByText(/開始使用/i);
  expect(ButtonElement).toBeInTheDocument();
});

test('renders 應用程式初使化中 Button', () => {
  render(
    <BrowserRouter>
      <Button toggle={false} />
    </BrowserRouter>,
  );
  const ButtonElement = screen.getByText(/應用程式初使化中/i);
  expect(ButtonElement).toBeInTheDocument();
});
