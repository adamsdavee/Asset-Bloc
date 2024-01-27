import {ethers, parseEther} from "ethers"

export const durationToDaysAndTimeStamp = (duration: number, durationType: number) => {
    let days: number = 0;

    switch(durationType) {
        case 0:
            days = 1 * duration
            break;
        case 1:
            days = 7 * duration
            break;
        case 3:
            days = 30 * duration
            break;
        case 3:
            days = 365 * duration
            break;
        default:
            break;
    }   
    const timestamp = (days * 24 * 60 * 60)
    return {days, timestamp}
}


export const formatAddress = (address: string) =>  {
    const formattedAddr = address.slice(0, 5) + "..." + address.slice(-4);

    return formattedAddr;

}


export const toWei = (ether: string) => parseEther(ether)

export const bigIntToString = (val: bigint) => {
    return ethers.formatEther(val);
  };
  