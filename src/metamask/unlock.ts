import { clickOnButton, typeOnInputField } from "../helpers";

import { DappeteerPage } from "../page";
import { getSignedIn, SetSignedIn } from ".";

export const unlock =
  (page: DappeteerPage, setSignedIn: SetSignedIn, getSignedIn: getSignedIn) =>
  async (password = "password1234"): Promise<void> => {
    if (await getSignedIn()) {
      throw new Error("You can't sign in because you are already signed in");
    }
    await page.bringToFront();
    await typeOnInputField(page, "Password", password);
    await clickOnButton(page, "Unlock");
    await setSignedIn(true);
  };
