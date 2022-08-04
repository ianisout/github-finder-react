import { useEffect, useState } from 'react'
import Spinner from '../layout/Spinner'
import UserItem from './UserItem'

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

    setUsers(data);
    setLoading(false);
  }

  if (!loading) {
    return (
      <div className='grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2'>
        {users.map((user) => (
          <UserItem key={user.id} user={user}></UserItem>
        ))}
      </div>
    )
  } else {
    return <Spinner />
  }
}

export default UserResults