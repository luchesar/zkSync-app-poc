import React, { useState, useEffect, useRef } from "react";
import axios, { CancelToken } from "axios";
import {CheckoutManager} from 'zksync-checkout'
// import {zkSyncBatchCheckout} from 'zksync-checkout'
type TokenLike = string;


export default function ZkSyncComponent() {
  const [text, setText] = useState("");
  const componentIsMounted = useRef(true);

  type TokenLike = string;


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
    const storeCurrency = params.get('store_currency');
    const siteUrl = params.get('site_url');
    console.log("URL params: " + orderId + " - " + woocommerceReference + " - " + layer + " - " + token + " - " + amount + " - " + storeCurrency + " - " + siteUrl);
    // const cancelTokenSource = CancelToken.source();

      async function processTransaction() {

      //TODO ingest and process the data from the Woocommerce redirection order started

      try {
        console.log("Inside process transaction async call");
        const manager = new CheckoutManager('rinkeby');

        let tokenAmountToPay : number;

        // TODO Recalculate token value (backend endpoint)
        //axios.get('https://sprintcheckout-mvp.herokuapp.com/checkout/v1/tokens/rates?layer=' + layer
        axios.get('http://localhost:8080/checkout/v1/tokens/rates?layer=' + layer
        + '&amount=' + amount + '&store_currency=' + storeCurrency + '&site_url=' + siteUrl)
        .then(res => {
          // tokenRates = JSON.parse(res.data) as ITokenRates;
          console.log(res.data)
          var tokenValue = Object.entries(res.data.tokenPrices).filter( function ([key, value]) {
            if(key == token?.toLowerCase()) {
              return value;
            }
          });
          console.log("Amount of "+ amount + " " + storeCurrency + " equals to " + tokenValue[0][1] + " " + token)
          tokenAmountToPay = tokenValue[0][1] as number

        }).then(res => {

        }
        ).catch(err => console.log("Axios err: ", err))

        // axios.post(`https://jsonplaceholder.typicode.com/users`, { user })
        // .then(res => {
        //   console.log(res);
        //   console.log(res.data);
        // })

        // TODO Split payment (merchant, spc_fee, zksync_fee)
        //  - get zksync estimated fee (DONE)
        //  - calculate spc_fee (0.3 % of total amount)
        //  - merchant = total_amount - spc_fee - zksync_fee (corner case - unlock account)

        // Create 2 zksync transactions
        const totalAmountTransaction1 = {
          // from: "0xCE8a3215C76a645331eb58ce54E12DB6cD0cA73E",
          to: "0xEDC3FB8eC1Bb8b10c956a67Ab783207cB6FD1c38",
          token: token as string,
          amount: amount as string,
        };

        const totalAmountTransaction2 = {
          // from: "0xCE8a3215C76a645331eb58ce54E12DB6cD0cA73E",
          to: "0xEDC3FB8eC1Bb8b10c956a67Ab783207cB6FD1c38",
          token: token as string,
          amount: amount as string,
        };

        const feeTransactions = [totalAmountTransaction1, totalAmountTransaction2];

        //Estimating transactions fee
        const estimatedFee = await manager.estimateBatchFee(feeTransactions, token as string);
        console.log("ESTIMATED FEE: " + estimatedFee);

        // - calculate spc_fee (0.3 % of total amount)
        let numAmount = Number(amount)
        const spcFee : number = numAmount * 0.003;
        const merchantAmount : number = +numAmount - +spcFee - +estimatedFee;

        let strMerchantAmount = String(merchantAmount)
        // TODO get addresses from backend to use in the next transactions (merchant and sprintcheckout)
        axios.get('http://localhost:8080/checkout/v1/merchant_address?layer=' + layer + '&site_url=' + siteUrl)
        .then(res => {
          console.log("Merchant address (in layer " + layer + ") is " + res.data)

          let publicAddress = res.data;

        }).catch(err => console.log("Axios err: ", err))

        const tx1 = {
          // from: "0xCE8a3215C76a645331eb58ce54E12DB6cD0cA73E",
          to: "0xEDC3FB8eC1Bb8b10c956a67Ab783207cB6FD1c38",
          token: token as string,
          amount: strMerchantAmount as string,
        };

        let strSpcFee = String(spcFee)
        const tx2 = {
          // from: "0xCE8a3215C76a645331eb58ce54E12DB6cD0cA73E",
          to: "0xB401938D098e95ee1987b4E2674c8cd523afcc32",
          token: "USDT",
          amount: strSpcFee as string,
        };

        const transactions = [tx1, tx2];

        const hashes = await manager.zkSyncBatchCheckout(transactions, token as string);
        const receipts = await manager.wait(hashes, 'COMMIT');
        console.log(receipts);

        // TODO navigate and send transaction result to another view (UI page)
        // Persist order (backend endpoint)
        // Render tx results and redirect (timeout or button) to woocommerce
        // Navigate to ORDER COMPLETE page in woocommerce passing the TX Receipt ID/Code (Callback)
        // Redirect with this params -> https://gripmonkeys.co.uk/checkout/order-received/7733/?key=wc_order_LLICPCA9WYf3s&spc_ref=AHD7$KD
        window.location.replace(siteUrl + '/checkout/order-received/' + orderId + '/?key=' + woocommerceReference + '&spc_ref=' + 'FOO_CONST')



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