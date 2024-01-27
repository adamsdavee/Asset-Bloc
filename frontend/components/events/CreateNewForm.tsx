import React, {useState, useContext, ChangeEvent} from 'react'
import {useRouter} from "next/router"
import AppContext from '@/context/app-context'
import { Contract } from 'ethers'


const CreateNewForm = () => {
  const router = useRouter()
    const appCtx = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(false)

    const [startAt, setStartAt] = useState(0)
    const [endAt, setEndAt] = useState(0)
    const [assetType, setAssetType] = useState("")
    const [assetPrice, setAssetPrice] = useState(0)
    const [nftAddress, setNftAddress]= useState("");

    const [startAtHasError, setStartAtHasError] = useState(false)
    const [endAtHasError, setEndAtHasError] = useState(false)
    const [assetPriceHasError, setAssetPriceHasError]= useState(false);
    const [assetTypeHasError, setAssetTypeHasError]= useState(false);
    const [nftAddressHasError, setNftAddressHasError]= useState(false);

    const {signer, contract, connected} = appCtx

    const handleStartAtChange = (e: ChangeEvent<HTMLInputElement>) => {
      setStartAt(Number(e.target.value))
  }

  const handleEndAtChange = (e: ChangeEvent<HTMLInputElement>) => {
      setEndAt(Number(e.target.value))
  }

  const handleAssetTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
      setAssetType(e.target.value)
  }

  const handleAssetPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
      setAssetPrice(Number(e.target.value))
  }

  const handleNftAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNftAddress(e.target.value)
  }

  let formIsValid = true;

  if (startAtHasError || endAtHasError || assetPriceHasError || assetTypeHasError || nftAddressHasError) {
    formIsValid = false;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (startAt < new Date().getTime()) {
      setStartAtHasError(true)
      return
    }

    if (endAt < startAt) {
      setEndAtHasError(true)
      return
    }

    if (assetPrice <= 0) {
      setAssetPriceHasError(true)
      return
    }

    if (assetType.trim() === "") {
      setAssetTypeHasError(true)
      return
    }

    if (nftAddress.trim() === "") {
      setNftAddressHasError(true)
      return
    }

    if (!connected) {
      alert("Please connect your wallet")
      return
    }

    setLoading(true)

    const response = await (contract!.connect(signer!) as Contract)
    ["createSaleEvent(uint256 _startAt, uint256 _endAt, string _assetType, uint256 _assetPrice, address _nftAddress)"]
    ( BigInt(`${startAt}`), BigInt(`${endAt}`), assetType, BigInt(`${assetPrice}`), nftAddress)

    response.wait().then((res: any) => {
        if (res.status === 1) {
            // its done
            console.log(res)
            setCreated(true)
            // get group id
            router.push("/events")
        }
    }).catch((err: any )=> {
        console.log(err)
    });

    setLoading(false)

  }

  return (
    
    <form onSubmit={handleSubmit} className='border py-4'>
      <div className="w-full mb-4">
          <label htmlFor='start-at' className={` block mb-2`}>Start At:</label>
          <input value={startAt} id="start-at" placeholder="0" onChange={handleStartAtChange} className='rounded-lg px-4 py-2 w-full border' />
      </div>

      <div className="w-full mb-4">
          <label htmlFor='end-at' className={` block mb-2`}>End At:</label>
          <input value={endAt} id="end-at" placeholder="0" onChange={handleEndAtChange} className='rounded-lg px-4 py-2 w-full border' />
      </div>

      <div className="w-full mb-4">
          <label htmlFor='end-at' className={` block mb-2`}>Asset Type:</label>
          <input value={assetType} id="end-at" placeholder="Land" onChange={handleAssetTypeChange} className='rounded-lg px-4 py-2 w-full border' />
      </div>

      <div className="w-full mb-4">
          <label htmlFor='end-at' className={` block mb-2`}>Asset Price:</label>
          <input value={assetPrice} id="end-at" placeholder="0" onChange={handleAssetPriceChange} className='rounded-lg px-4 py-2 w-full border' />
      </div>

      <div className="w-full mb-4">
          <label htmlFor='end-at' className={` block mb-2`}>NFT Address:</label>
          <input value={nftAddress} id="end-at" placeholder="0x..." onChange={handleNftAddressChange} className='rounded-lg px-4 py-2 w-full border' />
      </div>

      <button disabled={!formIsValid} className={`btn btn-contained btn-small rounded-md mt-2 bg-black px-4 py-2 text-white`}>
          {loading ? "Loading..." : "Create"}
      </button>
    </form>
  )
}

export default CreateNewForm