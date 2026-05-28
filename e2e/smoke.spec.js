import { test, expect } from "@playwright/test";

test.describe("KidQuest alpha smoke", () => {
  test("landing and login pages load", async ({ page }) => {
    await page.goto("/landing");
    await expect(page.getByRole("heading", { name: /kidquest|welcome|learn/i })).toBeVisible({
      timeout: 10000,
    });

    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("forgot password page loads", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByRole("heading", { name: /reset password/i })).toBeVisible();
  });
});
