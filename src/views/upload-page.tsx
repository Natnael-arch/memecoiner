import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { ConnectKitButton } from "connectkit"
import { useAccount, useWalletClient } from 'wagmi'
import { createCoin, DeployCurrency, type ValidMetadataURI } from "@zoralabs/coins-sdk"
import { baseSepolia } from 'viem/chains'
import { createPublicClient, http } from 'viem'
import './upload-page.css'

const UploadPage = () => {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [memeTitle, setMemeTitle] = useState('')
  const [isMinting, setIsMinting] = useState(false)

  const uploadToIPFS = async (file: File) => {
    try {
      const JWT = import.meta.env.VITE_PINATA_JWT

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      
      // Add metadata
      const metadata = JSON.stringify({
        name: memeTitle,
        keyvalues: {
          creator: address || 'unknown'
        }
      })
      formData.append('pinataMetadata', metadata)

      // Upload to Pinata
      const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${JWT}`
        },
        body: formData
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error?.details || 'Failed to upload to Pinata')
      }

      console.log('Upload successful:', data)
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
    } catch (error) {
      console.error('Error uploading to IPFS:', error)
      throw new Error('Failed to upload to IPFS')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMint = async () => {
    if (!selectedFile || !memeTitle || !isConnected || !address || !walletClient) return

    try {
      setIsMinting(true)

      // 1. Upload image to IPFS
      const imageUrl = await uploadToIPFS(selectedFile)

      // 2. Create metadata object
      const metadata = {
        name: memeTitle,
        description: `Meme created by ${address}`,
        image: imageUrl,
        attributes: [
          {
            trait_type: "Creator",
            value: address
          }
        ]
      }

      // 3. Upload metadata JSON to Pinata
      const JWT = import.meta.env.VITE_PINATA_JWT
      const metadataRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT}`
        },
        body: JSON.stringify(metadata)
      })
      const metadataData = await metadataRes.json()
      if (!metadataRes.ok) {
        throw new Error(metadataData.error?.details || 'Failed to upload metadata to Pinata')
      }
      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`

      // 4. Create a Viem public client for Base Sepolia
      const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });

      // 5. Create coin using Zora SDK with metadataUrl as the uri
      const result = await createCoin({
        name: metadata.name,
        symbol: "MEME",
        uri: metadataUrl as ValidMetadataURI,
        payoutRecipient: address,
        currency: DeployCurrency.ETH,
        chainId: 84532, // Base Sepolia chain ID
      }, walletClient, publicClient)

      console.log("Transaction hash:", result.hash)
      console.log("Coin address:", result.address)
      
      alert('Meme minted successfully!')
      
    } catch (error) {
      console.error('Minting failed:', error)
      alert('Failed to mint meme. Please try again.')
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="upload-page-container">
      <Helmet>
        <title>Create Meme - Memecoiner</title>
      </Helmet>
      <nav className="upload-page-navbar">
        <h1>Memecoiner</h1>
        <ConnectKitButton />
      </nav>
      <div className="upload-page-content">
        <h2>Create Your Meme</h2>
        <div 
          className="upload-area"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="preview-image" />
          ) : (
            <div className="upload-placeholder">
              <p>Drag and drop your image here or click to select</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
        </div>
        <div className="meme-form">
          <input
            type="text"
            placeholder="Enter meme title"
            value={memeTitle}
            onChange={(e) => setMemeTitle(e.target.value)}
            className="meme-title-input"
          />
          <button 
            onClick={handleMint}
            disabled={!selectedFile || !memeTitle || !isConnected || isMinting}
            className="mint-button"
          >
            {isMinting ? 'Minting...' : 'Mint Meme'}
          </button>
        </div>
        {!isConnected && (
          <p className="connect-wallet-message">
            Please connect your wallet to mint
          </p>
        )}
      </div>
    </div>
  )
}

export default UploadPage 