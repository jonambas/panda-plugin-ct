import { test, expect } from '@playwright/test';

test('Vite is running', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Vite \+ React/);
});

test.describe('codegen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('semantic token references', ({ page }) => {
    expect(page.getByText('{colors.tone.positive}')).toHaveClass(
      'bg_{colors.tone.positive}',
    );
    expect(page.getByText('{colors.tone.negative}')).toHaveClass(
      'bg_{colors.tone.negative}',
    );
  });

  test('raw values', ({ page }) => {
    expect(page.getByText('#0000ff')).toHaveClass('bg_#0000ff');
    expect(page.getByText('#ff0000')).toHaveClass('bg_#ff0000');
  });

  test('value keys', ({ page }) => {
    expect(page.getByText('#9a9a9a')).toHaveClass('bg_#9a9a9a');
    expect(
      page.getByText('{"base":"#000","lg":"#555","_hover":"#999"}'),
    ).toHaveClass('bg_#000 lg:bg_#555 hover:bg_#999');
  });
});

test.describe('parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('semantic tokens', ({ page }) => {
    expect(page.getByText('{colors.tone.positive}')).toHaveCSS(
      'background-color',
      'rgb(34, 197, 94)',
    );

    expect(page.getByText('{colors.tone.positive}')).toHaveCSS(
      'background-color',
      'rgb(34, 197, 94)',
    );
  });

  test('raw values', ({ page }) => {
    expect(page.getByText('#0000ff')).toHaveCSS(
      'background-color',
      'rgb(0, 0, 255)',
    );
    expect(page.getByText('#ff0000')).toHaveCSS(
      'background-color',
      'rgb(255, 0, 0)',
    );
  });

  test('value keys', async ({ page }) => {
    await expect(page.getByText('#9a9a9a')).toHaveCSS(
      'background-color',
      'rgb(154, 154, 154)',
    );

    const el = await page.getByText(
      '{"base":"#000","lg":"#555","_hover":"#999"}',
    );

    await expect(el).toHaveCSS('background-color', 'rgb(85, 85, 85)');
    await page.setViewportSize({ width: 320, height: 568 });
    await expect(el).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await el.hover();
    await expect(el).toHaveCSS('background-color', 'rgb(153, 153, 153)');
  });
});
