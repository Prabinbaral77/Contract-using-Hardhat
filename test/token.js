const { expect } = require("chai");

describe("Token Contract", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  });

  describe("deployment", async function () {
    it("should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("should assign the total supply of token to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("should transfer token between accounts", async function () {
      //transfer from owner to addr1
      await hardhatToken.transferToken(addr1.address, 5);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(5);

      //to transfer other than owner we need to connect
      await hardhatToken.connect(addr1).transferToken(addr2.address, 5);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(5);
    });

    it("should be failed if sender have not enough balance", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
      await expect(
        hardhatToken.connect(addr1).transferToken(owner.address, 1)
      ).to.be.revertedWith("Not sufficent token for transfer");

      expect(await hardhatToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("should update balance after each transaction", async function () {
      let ownerInitialBalance = await hardhatToken.balanceOf(owner.address);
      await hardhatToken.transferToken(addr1.address, 100);
      await hardhatToken.transferToken(addr2.address, 200);
      const ownerFinalBalance = await hardhatToken.balanceOf(owner.address);
      expect(ownerFinalBalance).to.equal(ownerInitialBalance - 300);

      const address1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(address1Balance).to.equal(100);

      const address2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(address2Balance).to.equal(200);
    });
  });
});
