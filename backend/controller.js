const { App, Octokit } = require("octokit");
const { createNodeMiddleware } = require("@octokit/webhooks");
const fs = require("fs");
const { setUser, sendReward, signer } = require("./transact");
const { sendBalanceMail } = require("./mail");
const { PushAPI } = require("@pushprotocol/restapi");
// import { ethers } from "ethers";


const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const app_client_id = process.env.APP_CLIENT_ID;
const app_secret = process.env.APP_SECRET;
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const gitapp = new App({
  appId: appId,
  privateKey: privateKey,
  webhooks: {
    secret: webhookSecret,
  },
  oauth: {
    clientId: app_client_id,
    clientSecret: app_secret,
  },
});

// webhook handlers
const messageForNewPRs =
  "Thanks for opening a new PR! Please follow our contributing guidelines to make your PR easier to review.";

async function handlePullRequestOpened({ octokit, payload }) {
  console.log(`Received a pull request event for #${payload.pull_request.number}`);
  console.log(payload.pull_request.user.id, payload.repository.id);
  // console.log()
  // sendReward: userId, repoId, label
  await sendReward(payload.pull_request.user.id.toString(), payload.repository.id.toString(), payload.pull_request.labels?.[0]?.name || "default");

}

gitapp.webhooks.on("pull_request.closed", handlePullRequestOpened);
// gitapp.webhooks.on("pull_request.opened", handlePullRequestOpened);

gitapp.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

const webhookMiddleware = createNodeMiddleware(gitapp.webhooks, { path: "/api/webhook" });



async function checkInstallation(req, res) {
  const installationId = req.query.id;
  const address = req.query.address;
  const code = req.query.code;
  console.log(installationId, address, code);
  try {

    const octokit = await gitapp.oauth.getUserOctokit({ code: code });
    const { data } = await octokit.request("GET /user/emails");
    const { data: installation_data } = await gitapp.octokit.request("GET /app/installations/{installation_id}", {
      installation_id: installationId,
    });
    let email = "-";
    for (let i = 0; i < data.length; i++) {
      if (data[i].primary) {
        email = data[i].email;
        break;
      }
    }
    // setuser: address, name, email, user_id, installation_id
    await setUser(address, installation_data.account.login, email, "" + installation_data.account.id, "" + installationId);

    return res.json({
      name: installation_data.account.login,
      email: email,
      userId: "" + installation_data.account.id,
      installationId: "" + installationId,
      commitCount: "0",
      rewardsEarned: "0",
      activeRepos: "0"
    })
  } catch (e) {
    console.log(e);
    return res.status(404).send("Error")
  }

}

async function getUser(req, res) {
  const installationId = req.query.id;
  const code = req.query.code;
  // const octokit = await gitapp.getInstallationOctokit(installationId);
  const octokit = await gitapp.oauth.getUserOctokit({ code: code });
  const { data } = await octokit.request("GET /user/emails");
  console.log(data);
  res.json({ message: "got it" });
}

async function getRepos(req, res) {
  try {
    const installationId = req.query.id;
    const username = req.query.name;
    // console.log("get_repo", username, installationId);
    const octokit = await gitapp.getInstallationOctokit(installationId);
    const { data: repos } = await octokit.request("GET /users/{username}/repos", {
      username: username,
    });
    // console.log(repos);
    const data = repos.map((repo) => {
      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        url: repo.html_url,
        description: repo.description,
        open_issues_count: repo.open_issues_count,
        owner_login: repo.owner.login,
        owner_id: repo.owner.id,
      };
    });
    return res.json(data);
  } catch (e) {
    console.log(e.message);
    return res.status(404).send("Error")
  }
  // return res.json({ message: "got it" });
}

// fix this 
// send email
async function sendMail(req, res) {
  // console.log(req.body);  
  const { data } = req.body;
  if (!data) return res.json({
    data: {
      result: "ok"
    }
  })
  sendBalanceMail(data.recipientEmail, data.balance, data.repoName)
  return res.json({
    data: {
      result: "ok"
    }
  })
}


async function sendPushNotification(userId, repoId, contributionType) {
  try {
    const sender = await PushAPI.initialize(signer, { env: "staging" });
    const noti = await sender.channel.send(["*"], {
      notification: { title: `${userId} congrats!!`, body: `You have earned ${contributionType} reward for ${repoId}`  },
      channel: "eip155:5:0xFC80A19A1475a98622D4b13b5105440995d403Ec",
    });
    // console.log(noti)
  } catch (e) {}
}

module.exports = {
  checkInstallation,
  getUser,
  getRepos,
  sendMail,
  webhookMiddleware,
  sendPushNotification,
};


