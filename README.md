
![devrewards-high-resolution-logo-black-on-white-background (1)](https://github.com/rushi3691/DevRewards/assets/71341783/de34cbe2-eb88-4e9b-b1b7-8b7fbb9f3ea2)


# DevRewards


Welcome to our project! Here, we present an innovative web3 application designed to revolutionize the way open source contributions are recognized and rewarded. Our platform seamlessly integrates with user's GitHub profiles, leveraging webhooks and a robust smart contract to incentivize and acknowledge valuable contributions made to repositories listed on our platform.

Open source software development thrives on collaboration, and we firmly believe in the importance of recognizing and rewarding the efforts of contributors who dedicate their time and expertise to improving projects. With the DevRewards, we aim to bridge the gap between the incredible work done by open source enthusiasts and the acknowledgement they deserve.

Our application provides a simple and secure way for users to connect their GitHub profiles, granting access to their webhooks. By monitoring users' repositories and tracking their contributions, we gather valuable data that enables us to accurately assess the impact of their work. Leveraging the power of our smart contract, we can then allocate rewards based on predefined criteria, ensuring fairness and transparency in the process.


## Key Features

- Simple to use: Connect your wallet and GitHub account to get started.
- Contribute to listed projects: Start contributing to existing projects immediately.
- Automatic reward delivery: The platform ensures rewards are delivered to contributors automatically.
- List your own repositories: Share your projects on the platform and invite others to contribute.
- Chainlink Oracle integration: Balance notification system for project owners to send emails via Gmail.
- Logs: See all the transactions happening through the platform, such as funding, withdrawing, and rewarding code contributions.


## Demo
Do checkout our project once

Live Link 👉 **[DevRewards](https://devrewards.vercel.app/)**
**Use Sepolia Testnet**

Click on the link below to see our demo video where we have given a demo of our finished project while explaining the complex logic behind them.

Video 👉 **[Demo](https://www.youtube.com/watch?v=BQL2Pmx8i9I)**


## Usage

To use DevRewards, follow these steps:

1. Visit the DevRewards website at [DevRewards](https://devrewards.vercel.app/)
2. Connect your wallet and GitHub account to the platform.
3. Browse the catalogue page to find listed repositories and rewards they offer.
4. Contribute to the repositories by submitting code contributions (pull requests).
5. Visit the dashboard page to manage your repositories and set reward rules.
6. Explore the logs page to track transactions and activities on the platform.


## Architecture

![hackathon (2)](https://github.com/rushi3691/DevRewards/assets/71341783/a57a3f00-96e3-4264-9422-d1cf6b17f186)

As you can see in the diagram, there are several components to the system.
- The user accesses the DevRewards web app and connects their wallet and Github account.
- The web app communicates with a smart contract running on Ethereum that stores all user details like wallet address, Github username, listed repositories, their reward rules, their balances etc.
- There are three services running on AWS EC2 instances:
  - A Chainlink node which is used to implement one of the key features of DevRewards: notification system. When balance of a repository falls below certain threshold point, smart contract identifies it and sends email notification via external adapter connected through Chainlink node.
  - A custom backend service that handles Github webhook events triggered when someone contributes to code of listed repository. This service is partly responsible for identifying and distributing rewards to users based on their contributions. After recieving webhook event of code contribution (triggered when PR is merged), it communicates with the smart contract to send reward to the user. The smart contract then processes validation and distribution of rewards based on predefined criteria.<br>
 This backend also provides other features related to Github such as listing user's repositories(on Github), getting user's github account info, etc.
  - An External Adapter that sends emails using Gmail account
- Smart contract manage rewards (earned by users based on their contributions made through GitHub), reward rules, repositories listed on the platform, balances of repositories on the platform(funding, withdrawal), etc.

## Technology

- Frontend: Next.js, Tailwind CSS, Wagmi
- Backend: Smart contract, Express.js, Node.js, Chainlink Oracle
- Deployment: Docker, AWS, Vercel


## Add-ons

For the best experience we recommend having
- Browser support: Add metamask or some other wallet extension to be installed
  (has been tested using metamask only)

## Authors

- [@rushikesh](https://github.com/rushi3691)
- [@kshitij](https://www.github.com/Kshitij0O7)



## Feedback

If you have any feedback, please reach out to us at ksmahajan@gmail.com
