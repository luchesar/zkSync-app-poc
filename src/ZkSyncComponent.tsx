import React, { useState, useEffect, useRef } from "react";
import axios, { CancelToken } from "axios";
import {CheckoutManager} from 'zksync-checkout'
// import {zkSyncBatchCheckout} from 'zksync-checkout'


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

    const search = window.location.search;
    const params = new URLSearchParams(search);
        // ?order_id=7733&woo_ref=wc_order_LLICPCA9WYf3s&layer=zksync&token=USDT?amount=50&storeCurrency=EUR
    const orderId = params.get('order_id');
    const woocommerceReference = params.get('woo_ref');
    const layer = params.get('layer');
    const token = params.get('token');
    const amount = params.get('amount');
    const storeCurrency = params.get('storeCurrency');
    const siteUrl = params.get('site_url');
    console.log("URL params: " + orderId + " - " + woocommerceReference + " - " + layer + " - " + token + " - " + amount + " - " + storeCurrency + " - " + siteUrl);
    // const cancelTokenSource = CancelToken.source();

      async function processTransaction() {

      //TODO ingest and process the data from the Woocommerce redirection order started

      try {
        console.log("Inside process transaction async call");
        const manager = new CheckoutManager('rinkeby');

        // TODO Recalculate token value (backend endpoint)
        // axios.get('https://sprintcheckout-mvp.herokuapp.com/checkout/v1/tokens/rates?layer=' + layer
        axios.get('http://localhost:8080/checkout/v1/tokens/rates?layer=' + layer
        + '&amount=' + amount + '&storeCurrency=' + storeCurrency + '&site_url=' + siteUrl)
        .then(res => {
          const tokenRates = res.data;
          console.log(tokenRates)
        }).catch(err => console.log("Axios err: ", err))

        // axios.post(`https://jsonplaceholder.typicode.com/users`, { user })
        // .then(res => {
        //   console.log(res);
        //   console.log(res.data);
        // })



        // TODO Split payment (merchant, spc_fee, zksync_fee)
        //  - get zksync estimated fee
        //  - calculate spc_fee (0.3 % of total amount)
        //  - merchant = total_amount - spc_fee - zksync_fee (corner case - unlock account)

        // Create 2 zksync transactions

        const tx1 = {
          // from: "0xCE8a3215C76a645331eb58ce54E12DB6cD0cA73E",
          to: "0xEDC3FB8eC1Bb8b10c956a67Ab783207cB6FD1c38",
          token: "USDT",
          amount: "59640000",
        };

        const tx2 = {
          // from: "0xCE8a3215C76a645331eb58ce54E12DB6cD0cA73E",
          to: "0xB401938D098e95ee1987b4E2674c8cd523afcc32",
          token: "USDT",
          amount: "150000",
        };

        const transactions = [tx1, tx2];
        const hashes = await manager.zkSyncBatchCheckout(transactions,"USDT");
        const receipts = await manager.wait(hashes, 'COMMIT');
        console.log(receipts);

        // TODO navigate and send transaction result to another view (UI page)
        // Persist order (backend endpoint)
        // Render tx results and redirect (timeout or button) to woocommerce
        // Navigate to ORDER COMPLETE page in woocommerce passing the TX Receipt ID/Code (Callback)
        // Redirect with this params -> https://gripmonkeys.co.uk/checkout/order-received/7733/?key=wc_order_LLICPCA9WYf3s&spc_ref=AHD7$KD
        window.location.replace('https://gripmonkeys.co.uk/checkout/order-received/7733/?key=wc_order_LLICPCA9WYf3s&spc_ref=AHD7$KD')



      } catch (err) {
        console.error(err);
      }
    }

    // Redirect to Woocommerce order received + order_id

    processTransaction().then(r => {
      console.log("After promise returned")
    });

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