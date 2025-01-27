const {run}=require("hardhat")
const verify=async(contractAddress,args)=>{
    console.log("Verfiying contract...")
    try{
        await run("Verify:verify",{
            address:contractAddress,
            constructorArguments:args,
        })
    }catch(error){
        if(error.message.toLowerCase().includes("already verified")){
            console.log("already verified!!")
        }else{
            console.log(e)
        }
    }
}
module.exports={verify}