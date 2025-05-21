const JadeContract = artifacts.require('./JadeContract.sol')

contract('Test JadeContract', ([account, seller, buyer]) => {
    let jadeContract;
    console.log("account "+ account);
    console.log("seller " + seller);
    console.log("buyer " + buyer);
  
    // Deploy a new instance of the contract before each test
    before(async () => {
        jadeContract = await JadeContract.deployed()
    });
    
    describe('deployment', async () => {
        it('deploys successfully, address check verified', async () => {
            // Get the first account
            console.log("First account = " + account);
            //get the address and verify
            const address = await jadeContract.address
            console.log(address);
            //not equal to 0 and not empty and not null ,not undefined
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '');
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
    });

    describe('verify company name', async () => {
        it('verify company name', async () => {
            //get the company name using the function getCompanyName
            const companyName = await jadeContract.getCompanyName()
            console.log(companyName);
            //check if company name equal Jade Veritas
            assert.equal(companyName, "Jade Veritas", "company name is not correct")
        })
    })

    describe('verify jade count', async () => {
        it('verify jade count', async () => {
            //get the jadecount using the function getNoOfJades
            const jadeCount = await jadeContract.getNoOfJades()
            console.log(jadeCount);
            //check if jadecount is zero
            assert.equal(jadeCount, 0, "jadecount is not zero")
        })
    })

    describe('adding jades', async () => {
        console.log("account "+ account);
        console.log("seller " + seller);
        console.log("buyer " + buyer);
    
            let result, jadeCount
            before(async () => {
    let reg = await jadeContract.registerJade();
    
     result = await jadeContract.addJadeInfo(1, "JADE001", "The Tealview", "China", "2021-05-10", "80mm x 90mm", "Green", "Translucent", web3.utils.toWei('10', 'Ether'), {from: seller}) 
                jadeCount = await jadeContract.getNoOfJades();
                console.log(jadeCount)
             })
    
             it('verifying jade id', async () => {      
                const event = result.logs[0].args
                console.log("Result data  " + event);
                console.log("id " + event.id);
                assert.equal(event.id, "JADE001", "jade id is correct");
            })
        
            it('verifying jade name', async () => {      
                const event = result.logs[0].args
                console.log("Result data  " + event);
                console.log("Name " + event.name);
                assert.equal(event.name, "The Tealview", "jade name is correct");
            })
        
            it('verifying jade Origin', async () => {      
              const event = result.logs[0].args
              console.log("Origin" + event.origin);
              assert.equal(event.origin, "China", "jade origin is correct");
            })
        
        
            it('verifying jade Mined Date', async () => {      
              const event = result.logs[0].args
              console.log("Mined Date " + event.minedDate);
              assert.equal(event.minedDate, "2021-05-10", "jade mined date is correct");
            })  
            
            it('verifying jade dimensions', async () => {      
              const event = result.logs[0].args
              console.log("Dimensions " + event.dimensions);
              assert.equal(event.dimensions, "80mm x 90mm", "jade dimensions is correct");
            })   

            it('verifying jade color', async () => {      
              const event = result.logs[0].args
              console.log("Color " + event.color);
              assert.equal(event.color, "Green", "jade color is correct");
            })   

            it('verifying jade translucency', async () => {      
              const event = result.logs[0].args
              console.log("Translucency " + event.translucency);
              assert.equal(event.translucency, "Translucent", "jade translucency is correct");
            })   
        })
    
        describe('adding owner', async () => {
                let result, jadeCount
                before(async () => {
        
         result = await jadeContract.addOwnerShipRecord(1, "Alice Johnson", "2021-05-20", "55551234", "alice.johnson@example.com", {from: seller}) 
                    jadeCount = await jadeContract.getNoOfJades();
                    console.log(jadeCount)
                 })
            
                it('verifying owner name', async () => {      
                    const event = result.logs[0].args
                    console.log("Result data  " + event);
                    console.log("Owner Name " + event.ownerName);
                    assert.equal(event.ownerName, "Alice Johnson", "owner name is correct");
                })
            
                it('verifying transfer date', async () => {      
                  const event = result.logs[0].args
                  console.log("Transfer Date" + event.transferDate);
                  assert.equal(event.transferDate, "2021-05-20", "transfer date correct");
                })
            
            
                it('verifying phone no.', async () => {      
                  const event = result.logs[0].args
                  console.log("Phone " + event.phone);
                  assert.equal(event.phone, "55551234", "phone no is correct");
                })
                
                it('verifying owner email', async () => {      
                    const event = result.logs[0].args
                    console.log("Email " + event.email);
                    assert.equal(event.email, "alice.johnson@example.com", "email is correct");
                  })   
            })
        describe('purchase jades', async () => {
                let event;
                let jadeCost = 15;
            
                it('verifying seller & buyer balance', async () => {
                  buyerBalance = await web3.eth.getBalance(buyer)
                  buyerBalanceEth = web3.utils.fromWei(buyerBalance, 'ether');
                  console.log("buyer balance " +  buyerBalanceEth);    
                  
                  sellerBalance = await web3.eth.getBalance(seller)
                  sellerBalanceEth = web3.utils.fromWei(sellerBalance, 'ether');
                  console.log("seller balance" +  sellerBalanceEth);
            
                  assert(buyerBalance > jadeCost )
                });
            
                it('purchase jade and check if buyer is the owner', async () => {
                  // SUCCESS: Buyer makes purchase
                  const jadeCount = await jadeContract.getNoOfJades();
                  console.log(jadeCount)
                  console.log(jadeCount.toNumber())
                  //buy the jade for 15 ether
                  jadeCostString = jadeCost.toString();
                  result = await jadeContract.purchaseJade(jadeCount, 
                                            { from: buyer, value: web3.utils.toWei(jadeCostString, 'Ether')})
                  // Check logs
                  console.log("output of purchase jade");
                  event = result.logs[0].args
                  console.log(event)
                  assert.equal(event.owner, buyer, 'buyer is the owner of the jade,  is correct')
                });
                it('verify jade status as sold', async () => {
                    console.log(event.status);
                    console.log(web3.utils.BN(event.status).toString());
                    let status = web3.utils.BN(event.status).toString();
                    // note that 0 is sold and 1 is available enum JadeStatus {Sold, Available} 
                    assert.equal(event.status, 0, 'jade status is correct')
                  });

                 // seller balance has to be 100eth + 15eth
                it('verify seller balance after sales', async() => {
                    //get balance
                    let currentSellerBal = await web3.eth.getBalance(seller)
                    //convert from wei to ether
                    currentSellerBalEth = web3.utils.fromWei(currentSellerBal, 'ether');
                    //convert to number 
                    currentSellerBalEthP =  parseInt(currentSellerBalEth, 10);
                    console.log("currentSellerBalEthP = " + currentSellerBalEthP);
                   
                    // add the ether value of the cost of the jade 
                    //conver seller balance to number
                    let sellerBalanceEthP =  parseInt(sellerBalanceEth, 10);
                    let expectedSellerBal = sellerBalanceEthP + jadeCost;
                    console.log("sellerBalanceEthP = " + sellerBalanceEthP);          
                    console.log("expectedSellerBal = " +  expectedSellerBal);         
                    assert.equal(expectedSellerBal.toString(), currentSellerBalEthP.toString())
                  });

                  it('verify buyer balance after sales', async() => {
                    //get balance
                    let currentBuyerBal = await web3.eth.getBalance(buyer)
                    //convert from wei to ether
                    currentBuyerBalEth = web3.utils.fromWei(currentBuyerBal, 'ether');
                    //convert to number 
                    //currentBuyerBalEthP =  parseInt(currentBuyerBalEth, 10);
                    currentBuyerBalEthP = parseFloat(currentBuyerBalEth).toFixed(2)
                    console.log("currentBuyerBalEthP = " + currentBuyerBalEthP);
                   
                    // add the ether value of the cost of the jade 
                    //convert seller balance to number
                    //let buyerBalanceEthP =  parseInt(buyerBalanceEth, 10);
                    let buyerBalanceEthP = parseFloat(buyerBalanceEth).toFixed(2)
                    let expectedBuyerBal = buyerBalanceEthP - jadeCost;
                    console.log("buyerBalanceEthP = " + buyerBalanceEthP);          
                    console.log("expectedBuyerBal = " +  expectedBuyerBal);         
                    assert.equal(expectedBuyerBal, currentBuyerBalEthP)
                  });
        })

        describe('add certificate', async () => {
          let result, jadeCount
          before(async () => {
            result = await jadeContract.addCertificateRecord(1, "BX1100029", 'Type A', '2021-06-21', 'NGI')
            jadeCount = await jadeContract.getNoOfJades();
            
          })
  
          it('verify certificationId', async () => {
            const event = result.logs[0].args
            assert.equal(event.certificationId, "BX1100029", 'certificationId correct')
          })
  
          it('verify grade', async () => {
            const event = result.logs[0].args
            assert.equal(event.grade, "Type A", 'grade correct')
          })
  
          it('verify issueDate', async () => {
            const event = result.logs[0].args
            assert.equal(event.issueDate, "2021-06-21", 'issueDate correct')
          })
  
          it('verify authority name', async () => {
            const event = result.logs[0].args
            assert.equal(event.authorityName, "NGI", 'authority name correct')
          })

        })

        describe('adding provenance record', async () => {
          let result, jadeCount
          before(async () => {
            result = await jadeContract.addProvenanceRecord(1, 'Zi Jin Ge', 'Yishun Street 51', '2021-07-20')
            jadeCount = await jadeContract.getNoOfJades();
          })
  
          it('verify handler name', async () => {
            const event = result.logs[0].args
            assert.equal(event.handlerName, "Zi Jin Ge", 'handler name correct');
          })
  
          it('verify handler address', async () => {
            const event = result.logs[0].args
            assert.equal(event.handlerAddress, "Yishun Street 51", 'handler address correct');
          })
  
          it('verify transfer date', async () => {
            const event = result.logs[0].args
            assert.equal(event.transferDate, "2021-07-20", 'transfer date correct');
          })

        })
  
  
        
});
