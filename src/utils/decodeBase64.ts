const decodeBase64 = (base64String: string) => {

  // Convert the URL-safe Base64 to standard Base64
  const standardBase64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
  
  // Decode the Base64 to binary data
  const binaryData = atob(standardBase64);
  
  // Create a Uint8Array from the binary data
  const uint8Array = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }
  
  // Decode the UTF-8 data
  const textDecoder = new TextDecoder('utf-8');
  const decodedString = textDecoder.decode(uint8Array);
  
  return decodedString
}

export default decodeBase64