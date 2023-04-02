import { Dappeteer } from "..";
import { DappeteerBrowser } from "../browser";
import { DappeteerPage } from "../page";
import { getAllNotifications, installSnap, invokeSnap } from "../snap";
import { getNotificationEmitter } from "../snap/getNotificationEmitter";
import { createDialogMethods } from "../snap/dialog";
import { acceptAddNetwork, rejectAddNetwork } from "./addNetwork";
import { approve } from "./approve";
import { confirmTransaction } from "./confirmTransaction";
import { deleteAccount, deleteNetwork, getTokenBalance } from "./helpers";
import { importPk } from "./importPk";
import { lock } from "./lock";
import { sign } from "./sign";
import { signTypedData } from "./signTypedData";
import { switchAccount } from "./switchAccount";
import { switchNetwork } from "./switchNetwork";
import { unlock } from "./unlock";
import { acceptAddToken, rejectAddToken } from "./addToken";
import { createAccount } from "./createAccount";

export type SetSignedIn = (state: boolean) => Promise<void>;
export type getSignedIn = () => Promise<boolean>;

export const getMetaMask = (page: DappeteerPage): Promise<Dappeteer> => {
  // modified window object to kep state between tests
  const setSignedIn = async (state: boolean): Promise<void> => {
    const evaluateFn = (s: boolean): void => {
      (window as unknown as { signedIn: boolean }).signedIn = s;
    };
    await page.evaluate(evaluateFn, state);
  };
  const getSignedIn = (): Promise<boolean> => {
    const evaluateFn = (): boolean =>
      (window as unknown as { signedIn: boolean | undefined }).signedIn !==
      undefined
        ? (window as unknown as { signedIn: boolean }).signedIn
        : true;
    return page.evaluate(evaluateFn);
  };

  return new Promise<Dappeteer>((resolve) => {
    resolve({
      acceptAddNetwork: acceptAddNetwork(page),
      rejectAddNetwork: rejectAddNetwork(page),
      approve: approve(page),
      confirmTransaction: confirmTransaction(page, getSignedIn),
      importPK: importPk(page),
      lock: lock(page, setSignedIn, getSignedIn),
      sign: sign(page, getSignedIn),
      signTypedData: signTypedData(page, getSignedIn),
      switchAccount: switchAccount(page),
      switchNetwork: switchNetwork(page),
      unlock: unlock(page, setSignedIn, getSignedIn),
      acceptAddToken: acceptAddToken(page),
      rejectAddToken: rejectAddToken(page),
      createAccount: createAccount(page),
      helpers: {
        getTokenBalance: getTokenBalance(page),
        deleteAccount: deleteAccount(page),
        deleteNetwork: deleteNetwork(page),
      },
      snaps: {
        invokeSnap,
        getNotificationEmitter: getNotificationEmitter(page),
        getAllNotifications: getAllNotifications(page),
        installSnap: installSnap(page),
        dialog: createDialogMethods(page),
      },
      page,
    });
  });
};

/**
 * Return MetaMask instance
 * */
export async function getMetaMaskWindow(
  browser: DappeteerBrowser
): Promise<Dappeteer> {
  const metaMaskPage = await new Promise<DappeteerPage>((resolve, reject) => {
    browser
      .pages()
      .then((pages) => {
        for (const page of pages) {
          if (page.url().includes("chrome-extension")) resolve(page);
        }
        reject("MetaMask extension not found");
      })
      .catch((e) => reject(e));
  });

  return getMetaMask(metaMaskPage);
}
