// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HealthInsurance is Ownable, ReentrancyGuard {
    struct Policy {
        uint256 id;
        address policyholder;
        uint256 coverageAmount;
        uint256 premium;
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }

    struct Claim {
        uint256 id;
        uint256 policyId;
        uint256 claimAmount;
        uint256 submissionDate;
        ClaimStatus status;
        string medicalDocuments;
        address claimant;  // Added to track who submitted the claim
    }

    enum ClaimStatus {
        Pending,
        Approved,
        Rejected
    }

    mapping(address => Policy[]) public userPolicies;
    mapping(uint256 => Policy) public policies;  // Added to track all policies by ID
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public userClaims;

    uint256 public policyCounter;
    uint256 public claimCounter;

    uint256 public constant MIN_COVERAGE = 1 * 10**18; // 1 USDC
    uint256 public constant MAX_COVERAGE = 1000000 * 10**18; // 1,000,000 USDC
    uint256 public constant MIN_PREMIUM_PERCENTAGE = 1; // 5%
    uint256 public constant MAX_PREMIUM_PERCENTAGE = 20; // 20%

    // Events
    event PolicyPurchased(
        address indexed policyholder, 
        uint256 indexed policyId, 
        uint256 coverageAmount, 
        uint256 premium
    );
    event ClaimSubmitted(
        address indexed policyholder, 
        uint256 indexed claimId, 
        uint256 claimAmount
    );
    event ClaimProcessed(
        uint256 indexed claimId, 
        ClaimStatus status
    );

    function getUserPolicies(address user) public view returns (Policy[] memory) {
        return userPolicies[user];
    }

    function getUserClaims(address user) public view returns (uint256[] memory) {
        return userClaims[user];
    }

    function getClaimDetails(uint256 claimId) public view returns (Claim memory) {
        return claims[claimId];
    }

    function getPolicyDetails(uint256 policyId) public view returns (Policy memory) {
        return policies[policyId];
    }
    
    function purchasePolicy(uint256 coverageAmount) external payable nonReentrant {
        require(
            coverageAmount >= MIN_COVERAGE && 
            coverageAmount <= MAX_COVERAGE, 
            "Invalid coverage amount"
        );

        uint256 premium = calculatePremium(coverageAmount);
        require(msg.value >= premium, "Insufficient premium payment");

        Policy memory newPolicy = Policy({
            id: policyCounter,
            policyholder: msg.sender,
            coverageAmount: coverageAmount,
            premium: premium,
            startDate: block.timestamp,
            endDate: block.timestamp + 365 days,
            isActive: true
        });

        userPolicies[msg.sender].push(newPolicy);
        policies[policyCounter] = newPolicy;  // Store in global policies mapping
        policyCounter++;

        emit PolicyPurchased(msg.sender, newPolicy.id, coverageAmount, premium);

        if (msg.value > premium) {
            payable(msg.sender).transfer(msg.value - premium);
        }
    }

    function submitClaim(
        uint256 policyId, 
        uint256 claimAmount, 
        string memory medicalDocuments
    ) external nonReentrant {
        Policy storage policy = policies[policyId];
        require(policy.policyholder == msg.sender, "Not the policy holder");
        require(policy.isActive, "Policy is not active");
        require(
            claimAmount <= policy.coverageAmount, 
            "Claim amount exceeds coverage"
        );

        Claim memory newClaim = Claim({
            id: claimCounter,
            policyId: policyId,
            claimAmount: claimAmount,
            submissionDate: block.timestamp,
            status: ClaimStatus.Pending,
            medicalDocuments: medicalDocuments,
            claimant: msg.sender
        });

        claims[claimCounter] = newClaim;
        userClaims[msg.sender].push(claimCounter);
        claimCounter++;

        emit ClaimSubmitted(msg.sender, newClaim.id, claimAmount);
    }

    function processClaim(
        uint256 claimId, 
        bool approve
    ) external onlyOwner nonReentrant {
        Claim storage claim = claims[claimId];
        Policy storage policy = policies[claim.policyId];

        require(claim.status == ClaimStatus.Pending, "Claim already processed");

        if (approve) {
            claim.status = ClaimStatus.Approved;
            payable(policy.policyholder).transfer(claim.claimAmount);
        } else {
            claim.status = ClaimStatus.Rejected;
        }

        emit ClaimProcessed(claimId, claim.status);
    }

    function processBatchClaims(
        uint256[] memory claimIds, 
        bool[] memory approvalStatuses
    ) external onlyOwner nonReentrant {
        require(
            claimIds.length == approvalStatuses.length, 
            "Mismatched claims and approval statuses"
        );

        for (uint256 i = 0; i < claimIds.length; i++) {
            Claim storage claim = claims[claimIds[i]];
            Policy storage policy = policies[claim.policyId];

            require(claim.status == ClaimStatus.Pending, "Claim already processed");

            if (approvalStatuses[i]) {
                claim.status = ClaimStatus.Approved;
                payable(policy.policyholder).transfer(claim.claimAmount);
            } else {
                claim.status = ClaimStatus.Rejected;
            }

            emit ClaimProcessed(claimIds[i], claim.status);
        }
    }

    // Calculate premium based on coverage amount
    function calculatePremium(
        uint256 coverageAmount
    ) internal pure returns (uint256) {
        uint256 premiumPercentage = MIN_PREMIUM_PERCENTAGE + 
            ((coverageAmount * (MAX_PREMIUM_PERCENTAGE - MIN_PREMIUM_PERCENTAGE)) / MAX_COVERAGE);
        
        return (coverageAmount * premiumPercentage) / 1000000;
    }

    // Withdraw contract balance (only owner)
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Fallback and receive functions
    receive() external payable {}
    fallback() external payable {}
}