const { expect } = require("chai")
const { ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

describe("HealthInsurance", function () {
  // Manual premium calculation function
  const calculatePremium = (coverageAmount) => {
    const MIN_PREMIUM_PERCENTAGE = 1n
    const MAX_PREMIUM_PERCENTAGE = 20n
    const MAX_COVERAGE = ethers.parseEther("1000000")
    
    const coverageAmountBigInt = BigInt(coverageAmount.toString())
    const maxCoverageBigInt = BigInt(MAX_COVERAGE.toString())
    
    const premiumPercentage = MIN_PREMIUM_PERCENTAGE + 
      ((coverageAmountBigInt * (MAX_PREMIUM_PERCENTAGE - MIN_PREMIUM_PERCENTAGE)) / maxCoverageBigInt)
    
    return (coverageAmountBigInt * premiumPercentage) / 1000000n
  }

  // Fixture to deploy the contract and set up test environment
  async function deployHealthInsuranceFixture() {
    const [owner, user1, user2] = await ethers.getSigners()
    
    const HealthInsurance = await ethers.getContractFactory("HealthInsurance")
    const healthInsurance = await HealthInsurance.deploy()
    
    return { healthInsurance, owner, user1, user2 }
  }

  describe("Policy Purchase", function () {
    it("Should allow purchasing a policy with valid coverage", async function () {
      const { healthInsurance, user1 } = await loadFixture(deployHealthInsuranceFixture)
      
      const coverageAmount = ethers.parseEther("10")
      const premium = calculatePremium(coverageAmount)
      
      await expect(
        healthInsurance.connect(user1).purchasePolicy(coverageAmount, { value: premium })
      ).to.emit(healthInsurance, "PolicyPurchased")
        .withArgs(user1.address, 0, coverageAmount, premium)
    })

    it("Should reject policy purchase with invalid coverage amount", async function () {
      const { healthInsurance, user1 } = await loadFixture(deployHealthInsuranceFixture)
      
      const tooLowCoverage = ethers.parseEther("0.1")
      const tooHighCoverage = ethers.parseEther("2000000")
      
      await expect(
        healthInsurance.connect(user1).purchasePolicy(tooLowCoverage)
      ).to.be.revertedWith("Invalid coverage amount")
      
      await expect(
        healthInsurance.connect(user1).purchasePolicy(tooHighCoverage)
      ).to.be.revertedWith("Invalid coverage amount")
    })

    it("Should reject policy purchase with insufficient premium", async function () {
      const { healthInsurance, user1 } = await loadFixture(deployHealthInsuranceFixture)
      
      const coverageAmount = ethers.parseEther("10")
      
      await expect(
        healthInsurance.connect(user1).purchasePolicy(coverageAmount, { value: 0 })
      ).to.be.revertedWith("Insufficient premium payment")
    })
  })

  describe("Claim Submission", function () {
    it("Should allow submitting a valid claim", async function () {
      const { healthInsurance, user1 } = await loadFixture(deployHealthInsuranceFixture)
      
      const coverageAmount = ethers.parseEther("10")
      const premium = calculatePremium(coverageAmount)
      
      // Purchase policy first
      await healthInsurance.connect(user1).purchasePolicy(coverageAmount, { value: premium })
      
      const claimAmount = ethers.parseEther("5")
      const medicalDocs = "document_hash_123"
      
      await expect(
        healthInsurance.connect(user1).submitClaim(0, claimAmount, medicalDocs)
      ).to.emit(healthInsurance, "ClaimSubmitted")
        .withArgs(user1.address, 0, claimAmount)
    })

    it("Should reject claim for inactive policy", async function () {
        const { healthInsurance, user1 } = await loadFixture(deployHealthInsuranceFixture)
        
        const coverageAmount = ethers.parseEther("10")
        const premium = calculatePremium(coverageAmount)
        
        // Purchase policy first
        await healthInsurance.connect(user1).purchasePolicy(coverageAmount, { value: premium })
        
        const claimAmount = ethers.parseEther("5")
        const medicalDocs = "document_hash_123"
        
        // Submit claim
        await healthInsurance.connect(user1).submitClaim(0, claimAmount, medicalDocs)
        
        // Process claim to make policy inactive (use owner as specified in original contract)
        await healthInsurance.processClaim(0, false)
        
        await expect(
          healthInsurance.connect(user1).submitClaim(0, claimAmount, medicalDocs)
        ).to.be.revertedWith("Policy is not active")
      })

    it("Should reject claim exceeding coverage amount", async function () {
      const { healthInsurance, user1 } = await loadFixture(deployHealthInsuranceFixture)
      
      const coverageAmount = ethers.parseEther("10")
      const premium = calculatePremium(coverageAmount)
      
      // Purchase policy first
      await healthInsurance.connect(user1).purchasePolicy(coverageAmount, { value: premium })
      
      const excessiveClaimAmount = ethers.parseEther("20")
      const medicalDocs = "document_hash_123"
      
      await expect(
        healthInsurance.connect(user1).submitClaim(0, excessiveClaimAmount, medicalDocs)
      ).to.be.revertedWith("Claim amount exceeds coverage")
    })
  })

  describe("Claim Processing", function () {
    it("Should allow owner to approve a claim", async function () {
      const { healthInsurance, user1, owner } = await loadFixture(deployHealthInsuranceFixture)
      
      const coverageAmount = ethers.parseEther("10")
      const premium = calculatePremium(coverageAmount)
      
      // Purchase policy first
      await healthInsurance.connect(user1).purchasePolicy(coverageAmount, { value: premium })
      
      const claimAmount = ethers.parseEther("5")
      const medicalDocs = "document_hash_123"
      
      // Submit claim
      await healthInsurance.connect(user1).submitClaim(0, claimAmount, medicalDocs)
      
      // Process claim
      await expect(
        healthInsurance.connect(owner).processClaim(0, true)
      ).to.emit(healthInsurance, "ClaimProcessed")
        .withArgs(0, 1) // 1 represents Approved status
    })

    it("Should reject claim processing by non-owner", async function () {
      const { healthInsurance, user1, user2 } = await loadFixture(deployHealthInsuranceFixture)
      
      const coverageAmount = ethers.parseEther("10")
      const premium = calculatePremium(coverageAmount)
      
      // Purchase policy first
      await healthInsurance.connect(user1).purchasePolicy(coverageAmount, { value: premium })
      
      const claimAmount = ethers.parseEther("5")
      const medicalDocs = "document_hash_123"
      
      // Submit claim
      await healthInsurance.connect(user1).submitClaim(0, claimAmount, medicalDocs)
      
      // Attempt to process claim by non-owner
      await expect(
        healthInsurance.connect(user2).processClaim(0, true)
      ).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })

  describe("Withdraw Functionality", function () {
    it("Should allow owner to withdraw contract balance", async function () {
        const { healthInsurance, user1, owner } = await loadFixture(deployHealthInsuranceFixture)
        
        const coverageAmount = ethers.parseEther("10")
        const premium = calculatePremium(coverageAmount)
        
        // Purchase policy to add funds to contract
        await healthInsurance.connect(user1).purchasePolicy(coverageAmount, { value: premium })
        
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address)
        
        // Withdraw
        const withdrawTx = await healthInsurance.connect(owner).withdraw()
        const withdrawReceipt = await withdrawTx.wait()
        
        const finalOwnerBalance = await ethers.provider.getBalance(owner.address)
        
        expect(finalOwnerBalance).to.be.gt(initialOwnerBalance)
      })

    it("Should reject withdrawal by non-owner", async function () {
      const { healthInsurance, user1 } = await loadFixture(deployHealthInsuranceFixture)
      
      await expect(
        healthInsurance.connect(user1).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner")
    })
  })
})