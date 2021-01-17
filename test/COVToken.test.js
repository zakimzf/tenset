const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { BN, expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert, expect } = require('chai');
const parse = require('csv-parse/lib/sync');
const fs = require('fs')
const path = require('path');

const Token = contract.fromArtifact('COVToken');

describe('СOVToken specific test', async function () {
  
  const roles = {
    admin: {key: 'ROLE_ADMIN', value: '0x0000000000000000000000000000000000000000000000000000000000000000'},
    minter: {key: 'ROLE_MINTER', value: '0x0000000000000000000000000000000000000000000000000000000000000001'},
    burner: {key: 'ROLE_BURNER', value: '0x0000000000000000000000000000000000000000000000000000000000000002'},
    transfer: {key: 'ROLE_TRANSFER', value: '0x0000000000000000000000000000000000000000000000000000000000000003'},
    alienTokenSender: {key: 'ROLE_ALIEN_TOKEN_SENDER', value: '0x0000000000000000000000000000000000000000000000000000000000000004'}
  }
  
  const locks = {
    burn: {key: 'LOCK_BURN', value: '0x0000000000000000000000000000000000000000000000000000000000000000'},
    transfer: {key: 'LOCK_TRANSFER', value: '0x0000000000000000000000000000000000000000000000000000000000000001'},
    mint: {key: 'LOCK_MINT', value: '0x0000000000000000000000000000000000000000000000000000000000000002'},
    addrTimeLock: {key: 'LOCK_ADDR_TIME_LOCK', value: '0x0000000000000000000000000000000000000000000000000000000000000003'},
    noLock: null
  }
  
  const actors = {
    admin: {role: roles.admin, addr: accounts[0]},
    minter: {role: roles.minter, addr: accounts[1]},
    burner: {role: roles.burner, addr: accounts[2]},
    transferer: {role: roles.transfer, addr: accounts[3]},
    alienTokenSender: {role: roles.alienTokenSender, addr: accounts[4]},
    user: {role: null, addr: accounts[5]},
  };
  
  const anotherUserAddr = accounts[6];
  
  const initialBalance = new BN(1000);
  
  beforeEach(async function () {
    this.token = await Token.new({ from: actors.admin.addr });
    let promises = [];
    for (const key in actors) {
      const actor = actors[key];
      if (actor.role !== null) {
        promises.push(this.token.grantRole(actor.role.value, actor.addr, { from: actors.admin.addr }));
      }
    }
    await Promise.all(promises);
    promises = [];
    for (const key in actors) {
      const actor = actors[key];
      promises.push(this.token.adminMint(actor.addr, initialBalance, { from: actors.minter.addr }));
    }
    promises.push(this.token.adminMint(anotherUserAddr, initialBalance, { from: actors.minter.addr }));
    await Promise.all(promises);
  });

  describe('COVToken access test', async function () {
    describe('Function: burn', async function () {
      testRestrictions(
        async function(actor) {
          it('burns the requested amount', async function () {
            const burnAmount = new BN(50);
            await this.token.burn(burnAmount, { from: actor.addr })
            expect(await this.token.balanceOf(actor.addr)).to.be.bignumber.equal(initialBalance.sub(burnAmount));
          })
        },
        async function(actor) {
          it('reverts', async function () {
            const burnAmount = new BN(50);
            await expectRevert(this.token.burn(burnAmount, { from: actor.addr }));
          })
        },
        true
      )
    })
    describe('Function: burnFrom', async function () {
      testRestrictions(
        async function(actor) {
          it('burns the requested amount', async function () {
            const burnAmount = new BN(50);
            await this.token.approve(actor.addr, burnAmount, { from: anotherUserAddr });
            await this.token.burnFrom(anotherUserAddr, burnAmount, { from: actor.addr });
            expect(await this.token.balanceOf(anotherUserAddr)).to.be.bignumber.equal(initialBalance.sub(burnAmount));
          })
        },
        async function(actor) {
          it('reverts', async function () {
            const burnAmount = new BN(50);
            await this.token.approve(actor.addr, burnAmount, { from: anotherUserAddr });
            await expectRevert(this.token.burnFrom(anotherUserAddr, burnAmount, { from: actor.addr }));
          })
        },
        true
      )
    })
    describe('Function: setTempFuncLock', async function () {
      testRestrictions(
        async function(actor) {
          it('set temporary function lock', async function () {
            await this.token.setTempFuncLock(locks.burn.value, true, { from: actor.addr })
            expect(await this.token.tempFuncLocks(locks.burn.value)).equals(true);
          })
        },
        async function(actor) {
          it('reverts', async function () {
            await expectRevert(this.token.setTempFuncLock(locks.burn.value, true, { from: actor.addr }), 'Sender requires permission');
          })
        },
        true
      )
    })
    describe('Function: finalFuncLock', async function () {
      testRestrictions(
        async function(actor) {
          it('set final function lock', async function () {
            await this.token.finalFuncLock(locks.mint.value, { from: actor.addr })
            expect(await this.token.finalFuncLocks(locks.mint.value)).equals(true);
          })
        },
        async function(actor) {
          it('reverts', async function () {
            await expectRevert(this.token.finalFuncLock(locks.mint.value, { from: actor.addr }), 'Sender requires permission');
          })
        },
        true
      )
    })
    describe('Function: adminMint', async function () {
      testRestrictions(
        async function(actor) {
          it('mints the requested amount', async function () {
            const mintAmount = new BN(50);
            await this.token.adminMint(actors.user.addr, mintAmount,  { from: actor.addr })
            expect(await this.token.balanceOf(actors.user.addr)).to.be.bignumber.equal(initialBalance.add(mintAmount));
          })
        },
        async function(actor) {
          it('reverts', async function () {
            const mintAmount = new BN(50);
            await expectRevert(this.token.adminMint(actors.user.addr, mintAmount, { from: actor.addr }), 'Sender requires permission');
          })
        },
        true
      )
    })
    describe('Function: adminBurn', async function () {
      testRestrictions(
        async function(actor) {
          it('burns the requested amount', async function () {
            const burnAmount = new BN(50);
            await this.token.adminBurn(actors.user.addr, burnAmount, { from: actor.addr })
            expect(await this.token.balanceOf(actors.user.addr)).to.be.bignumber.equal(initialBalance.sub(burnAmount));
          })
        },
        async function(actor) {
          it('reverts', async function () {
            const burnAmount = new BN(50);
            await expectRevert(this.token.adminBurn(actors.user.addr, burnAmount, { from: actor.addr }));
          })
        },
        true
      )
    })
    describe('Function: adminTimelockTransfer', async function () {
      testRestrictions(
        async function(actor) {
          it('sets temporary transfer lock for account', async function () {
            const lockTimeInDays = 17;
            const amount = new BN(50);
            const { receipt: { blockNumber } } = await this.token.adminTimelockTransfer(actors.user.addr, lockTimeInDays, { from: actor.addr })
            const block = await web3.eth.getBlock(blockNumber);
            const releaseTime = (new BN(block.timestamp)).add(time.duration.days(lockTimeInDays));
            expect(await this.token.locks(actors.user.addr)).to.be.bignumber.equal(releaseTime);
            await expectRevert(this.token.transfer(anotherUserAddr, 1, { from: actors.user.addr }), 'Token transfer locked');
            await this.token.approve(anotherUserAddr, amount, { from: actors.user.addr });
            await expectRevert(this.token.transferFrom(actors.user.addr, anotherUserAddr, amount, { from: anotherUserAddr }), 'Token transfer locked');
          })
        },
        async function(actor) {
          it('reverts', async function () {
            await expectRevert(this.token.adminTimelockTransfer(actors.user.addr, 1, { from: actor.addr }));
          })
        },
        true
      )
    })
    describe('Function: retrieveTokens', async function () {
      beforeEach(async function () {
        this.alienToken = await Token.new({ from: anotherUserAddr });
        await this.alienToken.adminMint(anotherUserAddr, initialBalance, { from: anotherUserAddr });
        await this.alienToken.transfer(this.token.address, initialBalance, { from: anotherUserAddr })
      });
      testRestrictions(
        async function(actor) {
          it('retrieves tokens sent by mistake', async function () {
            expect(await this.alienToken.balanceOf(anotherUserAddr)).to.be.bignumber.equal(new BN(0));
            await this.token.retrieveTokens(anotherUserAddr, this.alienToken.address, { from: actor.addr })
            expect(await this.alienToken.balanceOf(anotherUserAddr)).to.be.bignumber.equal(initialBalance);
          })
        },
        async function(actor) {
          it('reverts', async function () {
            await expectRevert(this.token.retrieveTokens(anotherUserAddr, this.alienToken.address, { from: actor.addr }))
          })
        },
        true
      )
    })
    describe('Function: distributeMint', async function () {
      beforeEach(async function () {
        this.receivers = [accounts[7], accounts[8], accounts[9]];
        this.mintAmounts = [new BN(1), new BN(2), new BN(3)]
      });
      testRestrictions(
        async function(actor) {
          it('mints the requested amounts', async function () {
            await this.token.distributeMint(this.receivers, this.mintAmounts,  { from: actor.addr })
            expect(await this.token.balanceOf(this.receivers[0])).to.be.bignumber.equal(this.mintAmounts[0]);
            expect(await this.token.balanceOf(this.receivers[1])).to.be.bignumber.equal(this.mintAmounts[1]);
            expect(await this.token.balanceOf(this.receivers[2])).to.be.bignumber.equal(this.mintAmounts[2]);
          })
        },
        async function(actor) {
          it('reverts', async function () {
            await expectRevert(this.token.distributeMint(this.receivers, this.mintAmounts,  { from: actor.addr }));
          })
        },
        true
      )
    })
    describe('Function: transfer', async function () {
      testRestrictions(
        async function(actor) {
          it('transfers the requested amount', async function () {
            const sendAmount = new BN(50);
            expect(await this.token.balanceOf(anotherUserAddr)).to.be.bignumber.equal(initialBalance);
            await this.token.transfer(anotherUserAddr, sendAmount, { from: actor.addr })
            expect(await this.token.balanceOf(anotherUserAddr)).to.be.bignumber.equal(initialBalance.add(sendAmount));
          })
        },
        async function(actor) {
          it('reverts', async function () {
            const sendAmount = new BN(50);
            await expectRevert(this.token.transfer(anotherUserAddr, sendAmount, { from: actor.addr }));
          })
        },
        true
      )
    })
    describe('Function: transferFrom', async function () {
      testRestrictions(
        async function(actor) {
          it('transfers the requested amount', async function () {
            const sendAmount = new BN(50);
            await this.token.approve(actor.addr, sendAmount, { from: anotherUserAddr });
            await this.token.transferFrom(anotherUserAddr, actor.addr, sendAmount, { from: actor.addr });
            expect(await this.token.balanceOf(actor.addr)).to.be.bignumber.equal(initialBalance.add(sendAmount));
            expect(await this.token.balanceOf(anotherUserAddr)).to.be.bignumber.equal(initialBalance.sub(sendAmount));
          })
        },
        async function(actor) {
          it('reverts', async function () {
            const sendAmount = new BN(50);
            await this.token.approve(actor.addr, sendAmount, { from: anotherUserAddr });
            await expectRevert(this.token.transferFrom(anotherUserAddr, actor.addr, sendAmount, { from: actor.addr }));
          })
        },
        true
      )
    })
  })
  
  function testRestrictions(onSuccess, onError, shouldSuccess) {
    for (const [actorName, actor] of Object.entries(actors)) {
      describe(`actor: ${actorName}`, async function () {
        for (const [lockName, lock] of Object.entries(locks)) {
          describe(`lock: ${lockName}`, async function () {
            if (lock === locks.noLock) {
              describe('no lock functions used', async function () {
                if (shouldSuccess) await onSuccess(actor);
                else await onError(actor);
              })
            } else {
              describe(`tempFuncLock(${lockName}) set`, async function () {
                beforeEach(async function() {
                  await this.token.setTempFuncLock(lock.value, true, { from: actors.admin.addr })
                })
                if (shouldSuccess) await onSuccess(actor);
                else await onError(actor);
              })
              describe(`finalFuncLock(${lockName}) set`, async function () {
                beforeEach(async function() {
                  await this.token.finalFuncLock(lock.value, { from: actors.admin.addr })
                })
                if (shouldSuccess) await onSuccess(actor);
                else await onError(actor);
              })
              describe(`adminTimelockTransfer(${actorName}, 1) set`, async function () {
                beforeEach(async function() {
                  await this.token.adminTimelockTransfer(actor.addr, 1, { from: actors.admin.addr })
                })
                if (shouldSuccess) await onSuccess(actor);
                else await onError(actor);
              })
            }
          })
        }
      })
    }
  }
});

function getCases() {
  const roles = ['ROLE_ADMIN', 'ROLE_MINTER', 'ROLE_BURNER', 'ROLE_TRANSFER', 'ROLE_ALIEN_TOKEN_SENDER', null]
  const input = fs.readFileSync(path.join(__dirname, 'restrictions.csv'), 'utf8');
  const records = parse(input, { from_line: 3 })
  return records.map(r => {
    return {
      func: r[0],
      lock: r[1] ? r[1] : null,
      rules: (() => {
        const result = [];
        for (let i = 0; i < roles.length; i++) {
          const offset = i * 4 + 2
          result.push({ role: roles[i], noLock: r[offset] === '1', accLock: r[offset + 1] === '1', tempLock: r[offset + 2] === '1', finalLock: r[offset + 3] === '1'})
        }
        return result;
      })()
    }
  })
}
