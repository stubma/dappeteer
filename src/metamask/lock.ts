import { clickOnButton, profileDropdownClick } from "../helpers";
import { DappeteerPage } from "../page";

import { getSignedIn, SetSignedIn } from "./index";

export const lock =
  (page: DappeteerPage, setSignedIn: SetSignedIn, getSignedIn: getSignedIn) =>
  async (): Promise<void> => {
    if (!(await getSignedIn())) {
      throw new Error("You can't sign out because you haven't signed in yet");
    }
    await page.bringToFront();

    await profileDropdownClick(page);
    await clickOnButton(page, "Lock");

    await setSignedIn(false);
  };
