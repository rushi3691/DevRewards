// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import './Mail.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract OrganisationRepo is Mail{
    struct User{
        string name;
        string email;
        string userId;
        string installationId;
        uint256 commitCount;
        uint256 rewardsEarned;
        uint256 activeRepos;
    }
    struct LabelInfo{
        string[] labelName;
        uint256[] prize;
        uint256 size;
        bool[] isValid;
    }
    struct Repo{
        string name;
        string email;
        string repoId;
        string url;
        uint256 balance;
        bool isPresent;
        uint256 commits;
        uint256 rewardsGiven;
    }
    struct RepoIdentity{
        address account;
        uint256 index;
        uint256 globalIndex;
        bool mailSent;
    }
    
    mapping(address=>User) public users;
    mapping(string=>address) internal userRegister;

    mapping(address=>Repo[]) public repos;
    mapping(string=>RepoIdentity) internal repoRegister;
    //mapping(address=>uint256) public activeRepos;

    mapping(string=>LabelInfo) internal labels;
    mapping(string=>mapping(string=>uint256)) internal labelIndex;

    address public admin;
    uint256 public fees;
    uint256 internal universalIndex;
    uint256 public totalActiveRepos;
    uint256 public totalRewardsGiven;
    uint256 public totalContributions;
    //use chainlink node to call email api ses --almost done

    Repo[] public repoList;
    User[] public userList;
    
    uint256 constant public thresholdAmount = 6000000000000000;
    string internal jobId;

    event contribute(
        string indexed userId,
        string indexed repoId,
        string userName,
        string repoName,
        address account,
        uint256 reward,
        uint256 timestamp
    );

    event fundsChanged(
        string indexed repoId,
        address indexed account,
        string repoName, 
        address _account,
        uint256 amount,
        bool isAdded,
        uint256 timestamp
    );

    constructor(uint256 _fees, string memory _jobId) 
    Mail() 
    {
        admin = msg.sender;
        fees = _fees;
        universalIndex=0;
        jobId = _jobId;
    }

    function addUser(address _user, string memory _name, string memory _email, string memory id, string memory installation_id) public{
        require(msg.sender == admin, "Unauthorized");
        require(keccak256(abi.encodePacked(users[_user].userId)) != keccak256(abi.encodePacked(id)), "User already exists");
        users[_user].name = _name;
        users[_user].email = _email;
        users[_user].userId = id;
        users[_user].installationId = installation_id;

        userRegister[id] = _user;

        User memory user = users[_user];
        userList.push(user);
    }

    function addRepo(string memory _name, string memory _email, string memory id, string memory _url, uint256 amount, uint256 _default) payable public{
        require(repoRegister[id].account == 0x0000000000000000000000000000000000000000, "Repository already exists");
        require(msg.value == amount,"Not the specified amount");
        require(amount != 0,"Cannot have zero balance");
        require(_default != 0, "Enter valid amount for bug fixing");
        require(_default<=amount, "Enter feasible prize");
        uint256 fee = fees*amount/100;
        payable(admin).transfer(fee);

        Repo memory newRepo = Repo(_name, _email, id, _url, amount-fee,true, 0, 0);
        repos[msg.sender].push(newRepo);
        uint256 _index = repos[msg.sender].length-1;
        //activeRepos[msg.sender]++;
        users[msg.sender].activeRepos++;
        labels[id].labelName.push("default");
        labels[id].prize.push(_default);
        labels[id].size++;
        labels[id].isValid.push(true);
        labelIndex[id][labels[id].labelName[0]]++;

        repoRegister[id].account = msg.sender;
        repoRegister[id].index = _index;
        repoRegister[id].globalIndex = universalIndex;
        universalIndex++;
        totalActiveRepos++;
        

        repoList.push(repos[msg.sender][_index]);
    }

    function addLabels(string memory _repoId, string memory _label, uint256 prize) public{
        require(repoRegister[_repoId].account != 0x0000000000000000000000000000000000000000, "Repository not found");
        require(msg.sender==repoRegister[_repoId].account, "Unauthorised Access");
        require(prize>0&&prize<=repos[msg.sender][repoRegister[_repoId].index].balance,"Enter a valid amount");
        require(labelIndex[_repoId][_label] == 0, "Label already exists");
        //require(keccak256(abi.encodePacked(users[msg.sender].userId)) != keccak256(abi.encodePacked(_label)), "User already exists");
        labels[_repoId].labelName.push(_label);
        labels[_repoId].prize.push(prize);
        labels[_repoId].isValid.push(true);
        labels[_repoId].size++;

        labelIndex[_repoId][_label] = labels[_repoId].size - 1;
    }

    function editLabel(string memory _repoId, string memory _labelName, uint256 newPrize) public{
        require(repoRegister[_repoId].account != 0x0000000000000000000000000000000000000000, "Repository not found");
        require(msg.sender==repoRegister[_repoId].account, "Unauthorised Access");
        require(newPrize>0&&newPrize<repos[msg.sender][repoRegister[_repoId].index].balance,"Enter a valid amount");
        
        uint256 index = labelIndex[_repoId][_labelName]-1;

        require(labels[_repoId].isValid[index], "Label not found");
        
        labels[_repoId].prize[index] = newPrize;
    }

    function deleteLabel(string memory _repoId, string memory _labelName) public{
        require(repoRegister[_repoId].account != 0x0000000000000000000000000000000000000000, "Repository not found");
        require(msg.sender==repoRegister[_repoId].account, "Unauthorised Access");
        
        uint256 index = labelIndex[_repoId][_labelName]-1;

        require(labels[_repoId].isValid[index], "Label not found");
        
        labels[_repoId].isValid[index] = false;
        labels[_repoId].prize[index] = 0;
        labels[_repoId].labelName[index] = "";
        labelIndex[_repoId][_labelName] = 0;
    }

    function commitOccured(string memory _userId, string memory _repoId, string memory labelId) public{
        require(msg.sender == admin, "Unauthorized");
        require(userRegister[_userId] != 0x0000000000000000000000000000000000000000, "User not found"); //code to be writen
        require(repoRegister[_repoId].account != 0x0000000000000000000000000000000000000000, "Repository not found");
        uint256 index = repoRegister[_repoId].index;
        uint256 _labelIndex = labelIndex[_repoId][labelId]-1;
        uint256 prize = labels[_repoId].prize[_labelIndex];
        require(prize<=repos[repoRegister[_repoId].account][index].balance, "Not enough funds");
        payable(userRegister[_userId]).transfer(prize);
        repos[repoRegister[_repoId].account][index].balance -= prize;
        repos[repoRegister[_repoId].account][index].commits++;
        repos[repoRegister[_repoId].account][index].rewardsGiven += prize;
        users[userRegister[_userId]].rewardsEarned += prize;

        //repoList Upgrade
        uint256 _globalIndex = repoRegister[_repoId].globalIndex;
        Repo storage repo = repoList[_globalIndex];
        repo.balance -= prize;
        repo.commits ++;
        repo.rewardsGiven += prize;

        users[userRegister[_userId]].commitCount++;
        totalRewardsGiven += prize;
        totalContributions++;
        // username, reponame
        emit contribute(_userId, _repoId, users[userRegister[_userId]].name, repo.name, userRegister[_userId], prize, block.timestamp);
        if(repo.balance<thresholdAmount && !repoRegister[_repoId].mailSent){
            string memory balanceString =  Strings.toString(repo.balance);
            mail(jobId, repo.email, balanceString, repo.name);
            repoRegister[_repoId].mailSent = true;
        }
    }

    function withdrawBalance(uint256 percent, string memory _repoId) public{
        require(repoRegister[_repoId].account != 0x0000000000000000000000000000000000000000, "Repository not found");
        require(msg.sender==repoRegister[_repoId].account, "Unauthorised Access");
        require(percent<=100,"Cannot withdraw the security amount");
        uint256 index = repoRegister[_repoId].index;
        uint256 amount = repos[msg.sender][index].balance*percent/100;
        payable(msg.sender).transfer(amount);
        repos[msg.sender][index].balance -= amount;

        //repoList Update
        uint256 _globalIndex = repoRegister[_repoId].globalIndex;
        Repo storage repo = repoList[_globalIndex];
        repo.balance -= amount;
        emit fundsChanged(_repoId, msg.sender, repo.name, msg.sender, amount, false, block.timestamp);
    }
    
    function deleteRepo(string memory _repoId) public{
        require(repoRegister[_repoId].account != 0x0000000000000000000000000000000000000000, "Repository not found");
        require(msg.sender==repoRegister[_repoId].account, "Unauthorised Access");
        uint256 index = repoRegister[_repoId].index;
        payable(msg.sender).transfer(repos[msg.sender][index].balance);
        repos[msg.sender][index].balance = 0;
        repoRegister[repos[msg.sender][index].repoId].account = 0x0000000000000000000000000000000000000000;
        repos[msg.sender][index].repoId = "";
        repos[msg.sender][index].name = "";
        repos[msg.sender][index].email = "";
        repos[msg.sender][index].url = "";
        repos[msg.sender][index].isPresent = false;
        //activeRepos[msg.sender]--;
        users[msg.sender].activeRepos--;

        //repoList Update
        uint256 _globalIndex = repoRegister[_repoId].globalIndex;
        Repo storage repo = repoList[_globalIndex];
        repo.name = "";
        repo.email = "";
        repo.repoId = "";
        repo.url = "";
        repo.balance = 0;
        repo.isPresent = false;

        totalActiveRepos--;

        //initiate empty arrays
        string[] memory labelOnDeleteRepo;
        uint256[] memory prizeOnDeleteRepo;
        bool[] memory isValidOnDeleteRepo;

        //assign labels array to empty array after deletion
        labels[_repoId].labelName = labelOnDeleteRepo;
        labels[_repoId].prize = prizeOnDeleteRepo;
        labels[_repoId].isValid = isValidOnDeleteRepo;
        labels[_repoId].size = 0;
    }

    function fundProject(uint256 amount, string memory repoId) payable public{
        require(repoRegister[repoId].account != 0x0000000000000000000000000000000000000000, "Repository not found");
        require(msg.value==amount);
        repos[repoRegister[repoId].account][repoRegister[repoId].index].balance += amount;
        uint256 _globalIndex = repoRegister[repoId].globalIndex;
        Repo storage repo = repoList[_globalIndex];
        repo.balance += amount;
        repoRegister[repoId].mailSent = false;
        emit fundsChanged(repoId, msg.sender, repo.name, msg.sender, amount, true, block.timestamp);
    }

    function viewLabels(string memory _repoId) public view returns(LabelInfo memory){
        // return labels of a repo
        return labels[_repoId];
    }

    function viewPublicRepos() public view returns ( Repo[] memory){
        // return public repos
        return repoList;
    }

    function viewUserRepos() public view returns ( Repo[] memory){
        // return public repos
        return repos[msg.sender];
    }
    function getPublicRepos() public view returns (Repo[] memory){
        return repoList;
    }

    function setJobId(string memory _jobid) public {
        require(msg.sender == admin, "Unauthorized");
        jobId = _jobid;
    }
    function getJobId() public view returns (string memory){
        require(msg.sender == admin, "Unauthorized");
        return jobId;
    }
    function getAllUsers() public view returns (User[] memory){
        return userList;
    }
}