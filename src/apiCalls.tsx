interface PostInfo {
  collaborators: number,
  stack: string,
  technologies: string[], 
  timeFrame: string
}

const postNewForm = async (info: PostInfo) => {
  let response = await fetch(`https://8c3a0c1f-6f70-4e2c-82aa-c8e6de99ae51.mock.pstmn.io/api/v1/users/1/projects`, {
    method: 'POST',
    body: JSON.stringify(info), 
    headers: {
      'Content-Type': 'application/json'
    }
  })
  let data = await response.json()
  if(data.message && data.message.includes('Error')) {
    throw new Error(`${data.message} -- Please try again`)
  }
  return data;
}

export  { postNewForm }