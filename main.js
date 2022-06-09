const express = require("express");
const cors = require("cors");
// enter ur secret key
const stripe = require("stripe")("sk_test_3GbYc99UNaJZ1297cBMeXnTo");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/checkout", async function (req, res) {
  const { token } = req.body;
  // Set your secret key. Remember to switch to your live secret key in production.
  // See your keys here: https://dashboard.stripe.com/apikeys
  const stripe = require("stripe")("sk_test_3GbYc99UNaJZ1297cBMeXnTo");

  // Token is created using Stripe Checkout or Elements!
  // Get the payment token ID submitted by the form:

  const charge = await stripe.charges.create({
    amount: 999,
    currency: "usd",
    description: "Example charge",
    source: token,
  });
  res.send({ charge });
});

app.get("/verify", async (req, res) => {
  // Set your secret key. Remember to switch to your live secret key in production.
  // See your keys here: https://dashboard.stripe.com/apikeys

  // In the route handler for /create-verification-session:
  // Authenticate your user.

  // Create the session.
  const verificationSession = await stripe.identity.verificationSessions.create(
    {
      type: "document",
      metadata: {
        user_id: "{{USER_ID}}",
      },
    }
  );
  // Return only the client secret to the frontend.
  const clientSecret = verificationSession.client_secret;
  res.send({ clientSecret });
});

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys

app.get("/verification-result/:id", async (req, res) => {
  const { id } = req.params;
  const verificationSession =
    await stripe.identity.verificationSessions.retrieve(id, {
      expand: ["verified_outputs"],
    });
  res.send(verificationSession);
  // const firstName = verificationSession.verified_outputs.first_name;
});

app.get("/verify-user", async (req, res) => {
  // Set your secret key. Remember to switch to your live secret key in production.
  // See your keys here: https://dashboard.stripe.com/apikeys
  const accountLink = await stripe.accountLinks.create({
    account: "acct_1KuTV3R3osfbdLM8",
    refresh_url: "https://near.tipjarlove.com/",
    return_url: "https://near.tipjarlove.com/",
    type: "account_onboarding",
    collect: "eventually_due",
  });

  res.send(accountLink);
});

app.listen(3000, () => {
  console.log("Stripe Up!");
});
