async function generatePosts(){
    const resp = fetch("http://localhost:3000/test-endpoint")
    const json = await resp.json()
    console.log('generatePosts',json)
}

export default generatePosts