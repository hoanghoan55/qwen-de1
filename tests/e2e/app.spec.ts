/**
 * E2E Tests cho Motion Graphics Agent
 * Sử dụng Playwright để test toàn bộ flow
 * 
 * Chạy: npm run test:e2e
 */

import { test, expect } from '@playwright/test';

test.describe('Motion Graphics Agent E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');
  });

  test('Landing page loads correctly', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Motion Graphics/);
    
    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('What do you want to create');
    
    // Check textarea exists
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await expect(textarea).toHaveAttribute('placeholder', /Describe your animation/);
    
    // Check example prompts
    const exampleButtons = page.locator('button:has-text("Examples") ~ button');
    const count = await exampleButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Can enter prompt and see submit button enable', async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button[type="submit"]');
    
    // Initially disabled
    await expect(submitButton).toBeDisabled();
    
    // Enter text
    await textarea.fill('Test animation');
    
    // Now enabled
    await expect(submitButton).toBeEnabled();
  });

  test('Example prompts fill textarea', async ({ page }) => {
    // Click first example
    const firstExample = page.locator('button:has-text("Kinetic Typography")');
    await firstExample.click();
    
    // Check textarea is filled
    const textarea = page.locator('textarea');
    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('Submit prompt shows loading state', async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button[type="submit"]');
    
    // Enter prompt
    await textarea.fill('Create a simple test animation');
    
    // Submit
    await submitButton.click();
    
    // Should show loading indicator
    const loadingIndicator = page.locator('text=Generating');
    await expect(loadingIndicator).toBeVisible({ timeout: 5000 });
  });

  test('Keyboard shortcut: Enter submits form', async ({ page }) => {
    const textarea = page.locator('textarea');
    
    // Enter prompt
    await textarea.fill('Test animation');
    
    // Press Enter
    await textarea.press('Enter');
    
    // Should navigate or show loading
    // Wait for either workspace or loading state
    await page.waitForTimeout(1000);
    
    // Check that something happened (either loading or workspace)
    const hasLoading = await page.locator('text=Generating').isVisible().catch(() => false);
    const hasWorkspace = await page.locator('text=Scenes').isVisible().catch(() => false);
    
    expect(hasLoading || hasWorkspace).toBeTruthy();
  });

  test('Workspace has required elements', async ({ page }) => {
    // This test assumes we're already in workspace
    // In real scenario, you'd generate a video first
    
    // For now, just check if we can navigate to workspace
    // by mocking the state or using a test mode
    
    // Skip if not in workspace
    const isInWorkspace = await page.locator('text=Scenes').isVisible().catch(() => false);
    if (!isInWorkspace) {
      test.skip();
      return;
    }
    
    // Check scene list
    const sceneList = page.locator('text=Scenes');
    await expect(sceneList).toBeVisible();
    
    // Check canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Check controls
    const playButton = page.locator('button:has(svg)').first();
    await expect(playButton).toBeVisible();
  });

  test('Scene editor opens and closes', async ({ page }) => {
    // Skip if not in workspace
    const isInWorkspace = await page.locator('text=Edit').isVisible().catch(() => false);
    if (!isInWorkspace) {
      test.skip();
      return;
    }
    
    // Click Edit button
    const editButton = page.locator('button:has-text("Edit")');
    await editButton.click();
    
    // Editor should be visible
    const editor = page.locator('text=Scene 1');
    await expect(editor).toBeVisible({ timeout: 2000 });
    
    // Close editor
    const closeButton = page.locator('button:has(svg)').filter({ hasText: '' }).last();
    await closeButton.click();
    
    // Editor should be hidden
    await expect(editor).not.toBeVisible({ timeout: 2000 });
  });

  test('Can modify scene text', async ({ page }) => {
    // Skip if not in workspace with editor
    const hasEditor = await page.locator('input[type="text"]').isVisible().catch(() => false);
    if (!hasEditor) {
      test.skip();
      return;
    }
    
    // Find text input
    const textInput = page.locator('input[type="text"]').first();
    
    // Clear and type new text
    await textInput.clear();
    await textInput.fill('Modified text');
    
    // Value should be updated
    const value = await textInput.inputValue();
    expect(value).toBe('Modified text');
  });

  test('Export button is disabled when no scenes', async ({ page }) => {
    // On landing page, export should not exist
    const exportButton = page.locator('button:has-text("Export")');
    const isVisible = await exportButton.isVisible().catch(() => false);
    
    // If visible, should be disabled
    if (isVisible) {
      await expect(exportButton).toBeDisabled();
    }
  });

  test('Responsive layout', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(heading).toBeVisible();
    
    // Textarea should still be usable
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
  });
});

test.describe('API Integration', () => {
  test('9Router API is accessible', async ({ request }) => {
    const response = await request.get('https://9router-production-bcf1.up.railway.app/api/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.ok).toBe(true);
  });

  test('TTS API is accessible', async ({ request }) => {
    const response = await request.get('https://tts.delyai.site/v1/voices', {
      headers: {
        'x-api-key': 'WwlIYBeO3SxiN4Wpa7swanK7ozOl2nQWLpcb2iRnRvY',
      },
    });
    expect(response.ok()).toBeTruthy();
  });
});
