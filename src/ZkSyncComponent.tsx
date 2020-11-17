import React, { useState, useEffect, useRef } from "react";
import axios, { CancelToken } from "axios";
import {CheckoutManager} from 'zksync-checkout'

export default function ZkSyncComponent() {
  const [text, setText] = useState("");
  const componentIsMounted = useRef(true);

  useEffect(() => {
    // each useEffect can return a cleanup function
    return () => {
      componentIsMounted.current = false;
    };
  }, []); // no extra deps => the cleanup function run this on component unmount

  useEffect(() => {
    // const cancelTokenSource = CancelToken.source();

      async function processTransaction() {
      try {
        console.log("Inside async");
        const manager = new CheckoutManager('rinkeby');

        const signedTransferTx = {
          from: "0xCE8a3215C76a645331eb58ce54E12DB6cD0cA73E",
          to: "0xEDC3FB8eC1Bb8b10c956a67Ab783207cB6FD1c38",
          token: "USDT",
          amount: "100000",
        };

        const transactions = [signedTransferTx];
        const hashes = await manager.zkSyncBatchCheckout(transactions,"USDT");
        const receipts = await manager.wait(hashes, 'COMMIT');
        console.log(receipts);

      } catch (err) {
        console.error(err);
      }
    }

    processTransaction();

    return () => {

    };
  });

  return (
      <div>
        <h1>Here's a random text</h1>
        <h2>{`"${text}"`}</h2>
        <button>More...</button>
      </div>
  );
}