import { useEffect, useState } from 'react'
import Spinner from '../layout/Spinner'

function UserResults() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers();
  }, [])

  const url = process.env.REACT_APP_GITHUB_URL ? process.env.REACT_APP_GITHUB_URL : 'https://api.github.com'
  // const auth = process.env.REACT_APP_GITHUB_TOKEN ? process.env.REACT_APP_GITHUB_TOKEN : ''

  const fetchUsers = async () => {
    const res = await fetch(`${url}/users`, {
      // headers: {
      //   Authorization: `token ${auth}`
      // }
    })

    const data = await res.json();

    console.log(data)

    setUsers(data);
    setLoading(false);
  }

  if (!loading) {
    return (
      <div className='grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
        {users.map((user) => (
          <h3>{user.login}</h3>
        ))}
      </div>
    )
  } else {
    return <Spinner />
  }
}

export default UserResults