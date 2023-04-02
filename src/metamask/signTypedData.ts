import { clickOnButton, clickOnLittleDownArrowIfNeeded } from "../helpers";

import { DappeteerPage } from "../page";
import { getSignedIn } from ".";

export const signTypedData =
  (page: DappeteerPage, getSignedIn: getSignedIn) =>
  async (): Promise<void> => {
    await page.bringToFront();
    if (!(await getSignedIn())) {
      throw new Error("You haven't signed in yet");
    }
    await page.reload();
    await clickOnLittleDownArrowIfNeeded(page);
    await clickOnButton(page, "Sign");
    // wait for MM to be back in a stable state
    await page.waitForSelector(".app-header", {
      visible: true,
    });
  };
